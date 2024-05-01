import { SubmitHandler, useForm } from 'react-hook-form';
import Logo from '../../components/logo/Logo';
import { useStore } from '../../context/store';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

interface IFormInput {
    nome: string;
    whatsapp: string;
    grupo: string;
}

export function UserLogin() {
    const groups = useStore((state) => state.groups);
    const setGroups = useStore((state) => state.setGroups);
    const setUserId = useStore((state) => state.setUser);
    const { register, handleSubmit } = useForm<IFormInput>();
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    'https://neurocooperacao-backend-8o0wti1lu-ghzoliveiras-projects.vercel.app/group',
                );
                setGroups(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(
                `Conectado ao servidor Socket.io com o ID ${newSocket.id}`,
            );
        });

        newSocket.on('error', (message) => {
            console.error(message);
        });
    }, []);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.post(
                `https://neurocooperacao-backend-8o0wti1lu-ghzoliveiras-projects.vercel.app/user`,
                {
                    nome: data.nome,
                    whatsapp: data.whatsapp,
                    grupo: data.grupo,
                },
            );
            setUserId(response.data.id);
            if (socket) {
                socket.emit('joinGame', data.grupo);
                navigate(`/sala-espera/${data.grupo}`);
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
                            placeholder="Nome"
                            className="mb-4 rounded-xl p-3"
                            {...register('nome', { required: true })}
                        />
                        <input
                            type="text"
                            placeholder="Whatsapp"
                            className="mb-4 rounded-xl p-3"
                            {...register('whatsapp', { required: true })}
                        />
                        <select
                            className="mb-8 rounded-xl p-3"
                            {...register('grupo', { required: true })}
                        >
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.nome}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="rounded-xl bg-[#ff7d0d] p-3 text-white"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
