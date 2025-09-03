declare global {
    interface Window {
        emailjs: {
            init: (publicKey: string) => void;
            send: (serviceId: string, templateId: string, templateParams: any) => Promise<any>;
            sendForm: (serviceId: string, templateId: string, formElement: HTMLFormElement) => Promise<any>;
        };
        firebase: {
            auth: () => {
                onAuthStateChanged: (callback: (user: { uid: string; email?: string; displayName?: string } | null) => void) => void;
                createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: { updateProfile: (profile: { displayName: string }) => Promise<void> } }>;
            };
            firestore: () => {
                collection: (name: string) => {
                    get: () => Promise<{
                        forEach: (callback: (doc: { data: () => any; id: string }) => void) => void;
                    }>;
                    doc: (id: string) => {
                        get: () => Promise<{ exists: boolean; data: () => any }>;
                    };
                };
            };
            apps: any[];
        };
    }
}

export { };
