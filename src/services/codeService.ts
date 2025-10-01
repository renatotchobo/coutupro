import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { AccessCode } from '../types/User';

export class CodeService {
  private codesCollection = 'accessCodes';
  private usersCollection = 'users';

  // Générer un code unique
  private generateUniqueCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  // Vérifier si un code existe déjà
  private async codeExists(code: string): Promise<boolean> {
    const q = query(
      collection(db, this.codesCollection),
      where('code', '==', code)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  // Générer un code unique qui n'existe pas encore
  private async generateNewUniqueCode(): Promise<string> {
    let code: string;
    do {
      code = this.generateUniqueCode();
    } while (await this.codeExists(code));
    return code;
  }

  // Créer un nouveau code d'accès pour un utilisateur
  async createAccessCode(
    userEmail: string,
    userName: string,
    adminId: string
  ): Promise<{ code: string; accessCodeId: string }> {
    try {
      const code = await this.generateNewUniqueCode();
      const accessCodeId = doc(collection(db, this.codesCollection)).id;

      const accessCodeData: Omit<AccessCode, 'id'> = {
        code,
        userId: '', // Will be set when user registers
        userEmail,
        userName,
        status: 'active',
        generatedAt: new Date().toISOString(),
        generatedBy: adminId
      };

      await setDoc(doc(db, this.codesCollection, accessCodeId), {
        ...accessCodeData,
        createdAt: serverTimestamp()
      });

      return { code, accessCodeId };
    } catch (error) {
      console.error('Error creating access code:', error);
      throw new Error('Erreur lors de la création du code d\'accès');
    }
  }

  // Vérifier si un code est valide
  async validateCode(email: string, code: string): Promise<{
    isValid: boolean;
    accessCode?: AccessCode;
    error?: string;
  }> {
    try {
      const q = query(
        collection(db, this.codesCollection),
        where('code', '==', code),
        where('userEmail', '==', email)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return {
          isValid: false,
          error: 'Code invalide ou email incorrect'
        };
      }

      const accessCodeDoc = snapshot.docs[0];
      const accessCode = { id: accessCodeDoc.id, ...accessCodeDoc.data() } as AccessCode;

      if (accessCode.status === 'revoked') {
        return {
          isValid: false,
          error: 'Ce code a été révoqué par l\'administrateur'
        };
      }

      if (accessCode.status === 'used') {
        return {
          isValid: false,
          error: 'Ce code a déjà été utilisé'
        };
      }

      return {
        isValid: true,
        accessCode
      };
    } catch (error) {
      console.error('Error validating code:', error);
      return {
        isValid: false,
        error: 'Erreur lors de la vérification du code'
      };
    }
  }

  // Marquer un code comme utilisé
  async markCodeAsUsed(accessCodeId: string, userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.codesCollection, accessCodeId), {
        status: 'used',
        userId,
        usedAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking code as used:', error);
      throw new Error('Erreur lors de la mise à jour du code');
    }
  }

  // Révoquer un code
  async revokeCode(accessCodeId: string, adminId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.codesCollection, accessCodeId), {
        status: 'revoked',
        revokedAt: new Date().toISOString(),
        revokedBy: adminId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error revoking code:', error);
      throw new Error('Erreur lors de la révocation du code');
    }
  }

  // Obtenir tous les codes générés par un admin
  async getCodesByAdmin(adminId: string): Promise<AccessCode[]> {
    try {
      const q = query(
        collection(db, this.codesCollection),
        where('generatedBy', '==', adminId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AccessCode[];
    } catch (error) {
      console.error('Error getting codes by admin:', error);
      return [];
    }
  }

  // Obtenir tous les codes (pour super admin)
  async getAllCodes(): Promise<AccessCode[]> {
    try {
      const q = query(
        collection(db, this.codesCollection),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AccessCode[];
    } catch (error) {
      console.error('Error getting all codes:', error);
      return [];
    }
  }

  // Réactiver un code révoqué
  async reactivateCode(accessCodeId: string): Promise<void> {
    try {
      await updateDoc(doc(db, this.codesCollection, accessCodeId), {
        status: 'active',
        revokedAt: null,
        revokedBy: null,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error reactivating code:', error);
      throw new Error('Erreur lors de la réactivation du code');
    }
  }
}

export const codeService = new CodeService();