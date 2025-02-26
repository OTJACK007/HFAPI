@@ .. @@
       case 7:
         return <KYBRecto 
           getRootProps={getFrontProps} 
           getInputProps={getFrontInputProps}
+          onNext={handleNextStep}
+          onBack={() => setStep(step - 1)}
+        />;
+
+      case 8:
+        return <KYBVerso 
+          getRootProps={getBackProps} 
+          getInputProps={getBackInputProps}
+          onNext={handleNextStep}
+          onBack={() => setStep(step - 1)}
         />;
 
-      case 8:
+      case 9:
         return <KYBMobile onContinueOnDevice={() => setStep(step + 1)} />;
 
-      case 9:
+      case 10:
@@ .. @@
           <div className="flex items-center justify-between mb-2">
             <h1 className="text-lg font-semibold">Vérification d'entreprise</h1>
             <span className="text-sm text-primary">
-              {step}/9
+              {step}/10
             </span>
           </div>
           <Progress 
-            value={(step / 9) * 100}
+            value={(step / 10) * 100}
             className="h-1"
             color="primary"
           />