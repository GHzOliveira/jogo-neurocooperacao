interface PainelAdminProps {
    children: React.ReactNode;
    className?: string;
}

export default function PainelAdmin({ children, className }: PainelAdminProps) {
    return (
        <div
            className={`container flex flex-col items-center justify-center gap-10 rounded-lg bg-white p-5 ${className}`}
        >
            <h1 className="mb-1 text-center text-2xl font-bold">
                Painel de Controle do Administrador
            </h1>
            <form className="flex w-full max-w-sm justify-center">
                {children}
            </form>
        </div>
    );
}
