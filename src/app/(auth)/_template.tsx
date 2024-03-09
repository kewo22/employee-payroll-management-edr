import { AuthTemplateProps } from "@/types/auth-template-props";

const AuthTemplate = (props: AuthTemplateProps) => {

    const { type, children } = props;

    return (
        <div className="w-[650px] bg-slate-100 p-20 shadow-lg">
            <h2 className="text-4xl font-semibold mb-2 text-center text-slate-700 uppercase">
                Payroll Portal
            </h2>
            <h1 className="font-semibold mb-10 text-center text-slate-700">
                {type === "login" && 'Please enter your Email & Password to login'}
                {type === "sign-up" && 'Please enter below details to sign up'}
            </h1>
            {children}
        </div>
    );
};

export default AuthTemplate;
