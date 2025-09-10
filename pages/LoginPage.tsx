import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
        {/* Lightbulb */}
        <path d="M10 2a1 1 0 011 1v1.172l1.428.476a1 1 0 01.572.949V11a5 5 0 01-10 0V5.597a1 1 0 01.572-.95L9 4.172V3a1 1 0 011-1z" />
        <path fillRule="evenodd" d="M10 12a4 4 0 00-3.8 2.937A.5.5 0 006.5 15h7a.5.5 0 00.3-.937A4 4 0 0010 12zm-3 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        {/* Spark */}
        <path d="M17.293 4.293a1 1 0 011.414 0l.293.293a1 1 0 010 1.414l-.293.293a1 1 0 01-1.414 0l-.293-.293a1 1 0 010-1.414l.293-.293zM16 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1z"/>
    </svg>
);

const GoogleIcon = ({ className = "h-5 w-5 mr-3" }: {className?: string}) => (
    <svg className={className} viewBox="0 0 48 48" >
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginStep, setLoginStep] = useState<'options' | 'email' | 'google'>('options');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Simulates login for Google or email form submission
  const handleFinalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate email/password here
    onLogin();
  };

  const renderContent = () => {
    switch(loginStep) {
        case 'google':
            return (
                <form onSubmit={handleFinalLogin} className="space-y-6 animate-fade-in text-center">
                    <GoogleIcon className="h-8 w-8 mx-auto" />
                    <h2 className="text-2xl font-semibold">Sign in with Google</h2>
                    <p className="text-sm text-gray-600">to continue to Quick Study</p>
                    <input type="email" required placeholder="Email or phone" className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                    <input type="password" required placeholder="Password" className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                    <div className="flex items-center justify-between !mt-8">
                        <button type="button" onClick={() => setLoginStep('options')} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                           Back
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                           Next
                        </button>
                    </div>
                </form>
            );
        case 'email':
             return (
                <form onSubmit={handleFinalLogin} className="space-y-4 animate-fade-in">
                    <button type="button" onClick={() => setLoginStep('options')} className="text-gray-500 hover:text-brand-primary flex items-center mb-4 text-sm font-semibold">
                        <BackArrowIcon />
                        Back
                    </button>
                    <div>
                    <label htmlFor="email" className="sr-only">Email address</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        placeholder="Email address"
                    />
                    </div>
                    <div>
                    <label htmlFor="password-input" className="sr-only">Password</label>
                    <input id="password-input" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                        placeholder="Password"
                    />
                    </div>
                    <button type="submit" className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                    Log In
                    </button>
                </form>
            );
        case 'options':
        default:
            return (
                <div className="space-y-4 animate-fade-in">
                    <button onClick={() => setLoginStep('google')} className="w-full bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <GoogleIcon />
                    Continue with Google
                    </button>

                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                        <div className="relative flex justify-center"><span className="bg-brand-bg px-2 text-sm text-gray-500">OR</span></div>
                    </div>

                    <button onClick={() => setLoginStep('email')} className="w-full bg-brand-primary text-white text-2xl font-handwritten py-4 rounded-xl shadow-md border-4 border-dashed border-white hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center">
                    <EmailIcon />
                    <span className="ml-2">Continue with Email</span>
                    </button>
                </div>
            )
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-brand-bg text-brand-text">
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-2">
            <LightbulbIcon />
            <h1 className="text-5xl font-logo text-brand-primary">Quick Study</h1>
        </div>
        <p className="font-handwritten text-brand-tagline text-xl mt-2">your pocket tutor</p>
      </div>

      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default LoginPage;