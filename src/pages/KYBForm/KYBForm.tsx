const handleNextStep = () => {
  if (step < 10) {
    setStep(step + 1);
  } else {
    navigate('/verifying');
  }
};

return (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-semibold">Vérification d'entreprise</h1>
        <span className="text-sm text-primary">
          {step}/10
        </span>
      </div>
      <Progress 
        value={(step / 10) * 100}
        className="h-1"
        color="primary"
      />

      {step === 1 && <KYBCompanyType onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 2 && <KYBCompanyDetails onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 3 && <KYBCompanyAddress onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 4 && <KYBUploadDocuments onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 5 && <KYBUploadProofOfAddress onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 6 && <KYBCompanyActivity onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 7 && <KYBRecto 
        getRootProps={getFrontProps} 
        getInputProps={getFrontInputProps}
        onNext={handleNextStep}
        onBack={() => setStep(step - 1)}
      />}
      {step === 8 && <KYBVerso 
        getRootProps={getBackProps} 
        getInputProps={getBackInputProps}
        onNext={handleNextStep}
        onBack={() => setStep(step - 1)}
      />}
      {step === 9 && <KYBMobile onContinueOnDevice={() => setStep(step + 1)} />}
      {step === 10 && <KYBFinal onContinueOnDevice={() => setStep(step + 1)} />}

      {step !== 4 && step !== 5 && step !== 7 && step !== 8 && (
        <div className="flex gap-2 pt-4">
          {step > 1 && step !== 7 && step !== 8 && (
            <Button
              type="button"
              variant="bordered"
              className="flex-1"
              onClick={() => setStep(step - 1)}
            >
              Retour
            </Button>
          )}
          {step !== 7 && step !== 8 && (
            <Button
              onClick={handleNextStep}
              color="primary"
              className={`flex-1 text-white ${step === 1 ? 'w-full' : ''}`}
              endContent={step < 10 && <ChevronRight size={20} />}
            >
              {step === 10 ? 'Terminer' : 'Continuer'}
            </Button>
          )}
        </div>
      )}
    </div>
  </div>
);