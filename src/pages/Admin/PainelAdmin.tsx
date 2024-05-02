import { useEffect, useState } from 'react';
import PainelAdmin from '../../components/logo/painelAdmin/PainelAdmin';
import { useStore } from '../../context/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

export default function PainelControllAdmin() {
    const groups = useStore((state) => state.groups);
    const setGroups = useStore((state) => state.setGroups);
    const navigate = useNavigate();
    const [editGroupId, setEditGroupId] = useState(null);
    const [editGroupName, setEditGroupName] = useState('');

    const handleCriarUnidade = () => {
        navigate('/admin/criar-unidade');
    };

    const handleDeleteGroup = async (id: string) => {
        try {
            const response = await axios.delete(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${id}`,
            );
            console.log('grupo excluido:', response.data);
            setGroups(groups.filter((group) => group.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditGroup = (event: React.MouseEvent, id, name: string) => {
        event.preventDefault();
        setEditGroupId(id);
        setEditGroupName(name);
    };

    const handleUpdateGroup = async () => {
        try {
            const response = await axios.put(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${editGroupId}`,
                {
                    name: editGroupName,
                },
            );
            console.log('Nome editado', response.data);
            setGroups(
                groups.map((group) =>
                    group.id === editGroupId
                        ? { ...group, nome: editGroupName }
                        : group,
                ),
            );
            setEditGroupId(null);
            setEditGroupName('');
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(
                    'https://neurocoop-backend-2225c4ca4682.herokuapp.com/group',
                );
                setGroups(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, [setGroups]);

    const handleGroupClick = (groupId: string) => {
        navigate(`/admin/painel-group/${groupId}`);
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <PainelAdmin>
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-10 w-full max-w-md">
                        <h1 className="mb-4 text-center text-2xl font-bold">
                            Unidades criadas
                        </h1>
                        <p className="mb-5">
                            Aperte em uma unidade para criar um jogo
                        </p>
                        {groups.length === 0 ? (
                            <p>
                                Não existem grupos. Por favor, crie uma nova
                                unidade.
                            </p>
                        ) : (
                            <ul className="space-y-4">
                                {groups.map((group, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between rounded border p-4 shadow"
                                        onClick={() =>
                                            handleGroupClick(group.id)
                                        }
                                    >
                                        <span>{group.nome}</span>
                                        <div className="flex space-x-2">
                                            <button
                                                className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-700"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleEditGroup(
                                                        event,
                                                        group.id,
                                                        group.nome,
                                                    );
                                                }}
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="rounded-full bg-red-500 p-2 text-white hover:bg-red-700"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handleDeleteGroup(group.id);
                                                }}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <button
                            className="rounded-xl bg-[#ff7d0d] p-3 text-white"
                            onClick={handleCriarUnidade}
                        >
                            Criar nova unidade
                        </button>
                    </div>
                </div>
                {editGroupId && (
                    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
                        <div className="mx-auto max-w-md rounded bg-white p-4">
                            <h2 className="mb-2">Editar Grupo</h2>
                            <input
                                className="mb-2 w-full border p-2"
                                value={editGroupName}
                                onChange={(e) =>
                                    setEditGroupName(e.target.value)
                                }
                            />
                            <button
                                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                                onClick={handleUpdateGroup}
                            >
                                Atualizar
                            </button>
                        </div>
                    </div>
                )}
            </PainelAdmin>
        </div>
    );
}
