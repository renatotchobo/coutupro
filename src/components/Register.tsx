@@ .. @@
 import { createUserWithEmailAndPassword } from 'firebase/auth';
 import { doc, setDoc } from 'firebase/firestore';
 import { auth, db } from '../firebase';
+import { codeService } from '../services/codeService';
 import { User } from '../types/User';
 
 export default function Register() {
@@ .. @@
   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [phone, setPhone] = useState('');
   const [email, setEmail] = useState('');
-  const [password, setPassword] = useState('');
+  const [accessCode, setAccessCode] = useState('');
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState('');
   const [error, setError] = useState('');
@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError('');
     setMessage('');
 
     try {
+      // 1. Vérifier le code d'accès
+      const codeValidation = await codeService.validateCode(email, accessCode);
+      
+      if (!codeValidation.isValid) {
+        setError(codeValidation.error || 'Code d\'accès invalide');
+        setLoading(false);
+        return;
+      }
+
+      // 2. Créer le compte Firebase Auth avec email + code comme mot de passe
+      const userCredential = await createUserWithEmailAndPassword(auth, email, accessCode);
+      const user = userCredential.user;
+
+      // 3. Sauvegarder les informations dans Firestore
       const userData: Omit<User, 'id'> = {
         firstName,
         lastName,
         phone,
         email,
         role: 'user',
-        createdAt: new Date().toISOString()
+        createdAt: new Date().toISOString(),
+        accessCode,
+        codeStatus: 'used',
+        codeGeneratedAt: codeValidation.accessCode?.generatedAt,
+        codeGeneratedBy: codeValidation.accessCode?.generatedBy
       };
 
-      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
-      const user = userCredential.user;
-
       await setDoc(doc(db, 'users', user.uid), userData);
 
+      // 4. Marquer le code comme utilisé
+      if (codeValidation.accessCode) {
+        await codeService.markCodeAsUsed(codeValidation.accessCode.id, user.uid);
+      }
+
       setMessage('Inscription réussie 🎉');
       
       // Redirection vers le dashboard après 2 secondes
@@ .. @@
               <input
                 type="email"
                 id="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="votre@email.com"
                 required
               />
             </div>

             <div>
-              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
-                Mot de passe (code admin)
+              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
+                Code d'accès (fourni par l'administrateur)
               </label>
               <input
-                type="password"
-                id="password"
-                value={password}
-                onChange={(e) => setPassword(e.target.value)}
+                type="text"
+                id="accessCode"
+                value={accessCode}
+                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
-                placeholder="Code fourni par l'admin"
+                placeholder="Ex: ABC123XY"
                 required
               />
+              <p className="text-sm text-gray-500 mt-1">
+                Entrez le code unique que l'administrateur vous a fourni
+              </p>
             </div>
 
             {error && (
@@ .. @@
             <button
               type="submit"
               disabled={loading}
               className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               {loading ? (
                 <div className="flex items-center justify-center">
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                   Inscription en cours...
                 </div>
               ) : (
                 'S\'inscrire'
               )}
             </button>
           </form>
@@ .. @@
         </div>
       </div>
     </div>
   );
 }