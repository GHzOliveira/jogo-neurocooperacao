import { useEffect, useState } from 'react';
import { useStore } from '../../../context/store';
import axios from 'axios';
import jsPDF from 'jspdf';

interface Transaction {
    id: string;
    userId: string;
    transactionType: string;
    amount: string;
}

interface Stats {
    average: number;
    median: number;
    mode: number;
}

export function Extrato() {
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const userId = useStore((state) => state.userId);

    useEffect(() => {
        // Buscar transação
        axios
            .get(`/group/${userId}/transaction`)
            .then((response) => {
                setTransaction(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Buscar estatísticas
        axios
            .get('http://35.160.120.126:3333/group/nEuroStats')
            .then((response) => {
                setStats(response.data);
            });
    }, [userId]);

    function downloadPDF() {
        try {
            console.log(transaction, stats);

            if (!transaction || !stats) return;

            const doc = new jsPDF();
            console.log(doc);

            doc.text('Transação', 10, 10);
            doc.text(`ID: ${transaction.id}`, 10, 20);
            doc.text(`Usuário: ${transaction.userId}`, 10, 30);
            doc.text(`Tipo: ${transaction.transactionType}`, 10, 40);
            doc.text(`Quantidade: ${transaction.amount}`, 10, 50);

            doc.text('Estatísticas', 10, 60);
            doc.text(`Média: ${stats.average}`, 10, 70);
            doc.text(`Mediana: ${stats.median}`, 10, 80);
            doc.text(`Moda: ${stats.mode}`, 10, 90);

            doc.save('extrato.pdf');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            {transaction && (
                <div className="mb-4">
                    <h2 className="mb-2 text-xl font-bold text-white">
                        Transação
                    </h2>
                    <p>ID: {transaction.id}</p>
                    <p>Usuário: {transaction.userId}</p>
                    <p>Tipo: {transaction.transactionType}</p>
                    <p>Quantidade: {transaction.amount}</p>
                </div>
            )}

            {stats && (
                <div className="mb-4">
                    <h2 className="mb-2 text-xl font-bold text-white">
                        Estatísticas
                    </h2>
                    <p>Média: {stats.average}</p>
                    <p>Mediana: {stats.median}</p>
                    <p>Moda: {stats.mode}</p>
                </div>
            )}

            {(transaction || stats) && (
                <button
                    onClick={downloadPDF}
                    className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    Baixar Extrato em PDF
                </button>
            )}
        </div>
    );
}
