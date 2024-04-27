import { SubmitHandler, useForm } from 'react-hook-form';
import Logo from '../../components/logo/Logo';
import { useNavigate } from 'react-router-dom';

interface IFormInput {
    user: string;
    password: string;
}

export default function LoginAdmin() {
    const { register, handleSubmit } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);
    const navigate = useNavigate();

    function handlePainel() {
        navigate('/admin/criar-unidade');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex min-h-screen items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-10">
                    <div>
                        <Logo />
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Usuário"
                            className="mb-4 rounded-xl p-3"
                            {...register('user', { required: true })}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            className="mb-8 rounded-xl p-3"
                            {...register('password', { required: true })}
                        />
                        <button
                            onClick={handlePainel}
                            className="rounded-xl bg-[#ff7d0d] p-3 text-white"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
