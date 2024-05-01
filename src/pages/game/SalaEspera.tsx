import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export function SalaEspera() {
    const { groupId } = useParams();
    const [, setMessage] = useState('');
    const [, setSocket] = useState<Socket | null>(null);
    const [gameRule, setGameRule] = useState<string | null>(null);
    const [hasMessage, setHasMessage] = useState(false);
    const [nRodada] = useState(1);
    const navigate = useNavigate();

    const handleRodada = () => {
        navigate(`/rodada/${groupId}/round/${nRodada}`);
    };

    useEffect(() => {
        connectToSocket();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                const response = await axios.get(
                    `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/gameRule`,
                );
                setGameRule(response.data);

                if (response.data) {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error(`Erro ao buscar a regra do jogo: ${error}`);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [groupId]);

    const connectToSocket = () => {
        const newSocket = io(
            'https://neurocoop-backend-2225c4ca4682.herokuapp.com',
        );
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(
                `Conectado ao servidor Socket.io com o ID ${newSocket.id}`,
            );
        });

        newSocket.on('gameStarted', () => {
            console.log('O jogo foi iniciado');
        });

        newSocket.on('storedMessage', (message) => {
            setMessage(message);
            setHasMessage(true);
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <h1 className="mb-8 text-4xl text-white">Regras do jogo</h1>
            <div className="mb-4 flex max-w-80 flex-col rounded bg-white px-8 pb-8 pt-6 shadow-md">
                <div className="mb-4">
                    <p className="text-grey-darker overflow-wrap mb-2 flex flex-col whitespace-pre-wrap break-all text-sm font-bold">
                        {gameRule}
                    </p>
                </div>
            </div>
            {hasMessage && (
                <button
                    className="mt-80 rounded bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-700"
                    onClick={handleRodada}
                >
                    Entrar no Jogo
                </button>
            )}
        </div>
    );
}
