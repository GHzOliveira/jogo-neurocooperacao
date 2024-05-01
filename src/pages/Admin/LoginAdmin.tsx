import { SubmitHandler, useForm } from 'react-hook-form';
import Logo from '../../components/logo/Logo';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface IFormInput {
    user: string;
    password: string;
}

export default function LoginAdmin() {
    const { register, handleSubmit } = useForm<IFormInput>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.get(
                `https://neurocooperacao-backend.vercel.app/admin/login?user=${data.user}&password=${data.password}`,
            );
            if (response.data.status === 200) {
                navigate('/admin/painel-controll');
            } else {
                alert('Usuário não encontrado');
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                            type="submit"
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
