@@ .. @@
 export default function Login() {
   const [email, setEmail] = useState('');
-  const [password, setPassword] = useState('');
+  const [accessCode, setAccessCode] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
 
@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     setError('');
 
     try {
-      await signInWithEmailAndPassword(auth, email, password);
+      // Utiliser le code d'accès comme mot de passe
+      await signInWithEmailAndPassword(auth, email, accessCode);
       // La redirection sera gérée par le useEffect dans App.tsx
     } catch (error: any) {
       console.error('Erreur de connexion:', error);
       if (error.code === 'auth/user-not-found') {
         setError('Aucun compte trouvé avec cet email');
       } else if (error.code === 'auth/wrong-password') {
-        setError('Mot de passe incorrect');
+        setError('Code d\'accès incorrect');
       } else if (error.code === 'auth/invalid-email') {
         setError('Format d\'email invalide');
       } else {
         setError('Erreur de connexion. Vérifiez vos identifiants.');
       }
     } finally {
       setLoading(false);
     }
   };
@@ .. @@
             </div>

             <div>
-              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
-                Mot de passe (code admin)
+              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
+                Code d'accès
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
             </div>
@@ .. @@