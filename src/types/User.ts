@@ .. @@
 export interface User {
   id: string;
   firstName: string;
   lastName: string;
   phone: string;
   email: string;
   role: 'admin' | 'user';
   createdAt: string;
+  accessCode?: string;
+  codeStatus: 'active' | 'revoked' | 'used';
+  codeGeneratedAt?: string;
+  codeGeneratedBy?: string; // Admin ID who generated the code
 }
+
+export interface AccessCode {
+  id: string;
+  code: string;
+  userId: string;
+  userEmail: string;
+  userName: string;
+  status: 'active' | 'revoked' | 'used';
+  generatedAt: string;
+  generatedBy: string; // Admin ID
+  usedAt?: string;
+  revokedAt?: string;
+  revokedBy?: string;
+}