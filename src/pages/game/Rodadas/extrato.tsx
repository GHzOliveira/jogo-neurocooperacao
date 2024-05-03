import { useEffect, useState } from 'react';
import { useStore } from '../../../context/store';
import axios from 'axios';
import jsPDF from 'jspdf';

interface Transaction {
    id: string;
    userId: string;
    transactionType: string;
    amount: string;
    roundId: string;
}

interface Stats {
    average: number;
    median: number;
    mode: number;
}

export function Extrato() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const userId = useStore((state) => state.userId);

    useEffect(() => {
        // Buscar transação
        axios
            .get(
                `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${userId}/transaction`,
            )
            .then((response) => {
                setTransactions(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });

        // Buscar estatísticas
        axios
            .get(
                'https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/nEuroStats',
            )
            .then((response) => {
                setStats(response.data);
            });
    }, [userId]);

    function downloadPDF() {
        try {
            if (!transactions || !stats) return;

            const doc = new jsPDF();

            const lineSpacing = 15; // Aumente o espaçamento entre as linhas aqui

            transactions.forEach((transaction, index) => {
                const initialVerticalOffset = 10;
                const verticalOffset =
                    initialVerticalOffset + index * 4 * lineSpacing;

                doc.text('Transação', 10, verticalOffset);
                doc.text(
                    `Tipo: ${transaction.transactionType}`,
                    10,
                    verticalOffset + lineSpacing,
                );
                doc.text(
                    `Quantidade: ${transaction.amount}`,
                    10,
                    verticalOffset + 2 * lineSpacing,
                );
                doc.text(
                    `Rodada: ${transaction.roundId}`,
                    10,
                    verticalOffset + 3 * lineSpacing,
                );
            });

            const statsVerticalOffset =
                10 + transactions.length * 4 * lineSpacing + 40; // Adicione um valor fixo para mover as estatísticas para baixo

            doc.text('Estatísticas', 10, statsVerticalOffset);
            doc.text(
                `Média: ${stats.average}`,
                10,
                statsVerticalOffset + lineSpacing,
            );
            doc.text(
                `Mediana: ${stats.median}`,
                10,
                statsVerticalOffset + 2 * lineSpacing,
            );
            doc.text(
                `Moda: ${stats.mode}`,
                10,
                statsVerticalOffset + 3 * lineSpacing,
            );

            doc.save('extrato.pdf');

            console.log('transação: ', transactions);
            console.log('estatísticas: ', stats);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            {Array.isArray(transactions) &&
                transactions.map((transaction, index) => (
                    <div key={index} className="mb-4 text-white">
                        <h2 className="mb-2 text-xl font-bold text-white">
                            Transação
                        </h2>
                        <p className="mb-5">
                            Qual o valor aplicado em cada rodada
                        </p>
                        <p>Tipo: {transaction.transactionType}</p>
                        <p>Quantidade: {transaction.amount}</p>
                        <p>Rodada: {transaction.roundId}</p>{' '}
                    </div>
                ))}

            {stats && (
                <div className="mb-20 text-white">
                    <h2 className="mb-2 text-xl font-bold text-white">
                        Estatísticas
                    </h2>
                    <p>Média: {stats.average}</p>
                    <p>Mediana: {stats.median}</p>
                    <p>Moda: {stats.mode}</p>
                </div>
            )}

            {(transactions || stats) && (
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
