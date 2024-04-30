import { useNavigate, useParams } from 'react-router-dom';
import PainelAdmin from '../../../components/logo/painelAdmin/PainelAdmin';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useStore } from '../../../context/store';
import axios from 'axios';

export function StartGroup() {
    const { groupId } = useParams();
    const [socket, setSocket] = useState<Socket | null>(null);
    const setMessage = useStore((state) => state.setMessages);
    const navigate = useNavigate();

    const handleBackClick = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate(-1);
    };

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

    const handleStartGame = async () => {
        console.log('start game', groupId);
        if (socket) {
            socket.emit('testMessage', 'Jogo Iniciado', groupId);
            setMessage(['Jogo iniciado']);
        }

        try {
            const roundResponse = await axios.get(
                `http://localhost:3333/group/${groupId}/round/1`,
            );
            const nEuro = roundResponse.data.nEuro;

            const usersResponse = await axios.get('http://localhost:3333/user');
            const users = usersResponse.data;
            for (const user of users) {
                await axios.patch(`http://localhost:3333/user/${user.id}`, {
                    nEuro,
                });
            }
        } catch (error) {
            console.error(`Erro ao buscar detalhes da rodada: ${error}`);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex flex-col">
                    <div>
                        <h1 className="bg-white">Jogadores na sala:</h1>
                    </div>
                    <div className="flex justify-between gap-10">
                        <div>
                            <button
                                className="focus:shadow-outline rounded bg-[#ff7d0d] px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none"
                                type="button"
                                onClick={handleStartGame}
                            >
                                Criar Unidade
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleBackClick}
                                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </PainelAdmin>
        </div>
    );
}
