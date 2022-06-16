import Cliente from "../core/Cliente";
import ClienteRepositorio from "../core/ClienteRepositorio";
import firebase from "./config";
import firestore from 'firebase/firestore'

export default class ColecaoCliente implements ClienteRepositorio {

    #conversor = {
        toFirestore(cliente: Cliente) {
            return {
                nome: cliente.nome,
                idade: cliente.idade,
            }
        },
       
        fromFirestore(snapshot: firestore.QueryDocumentSnapshot, options: firestore.SnapshotOptions): Cliente {
            const dados = snapshot.data(options)
            return new Cliente(dados.nome, dados.idade, snapshot.id)
        } 
    }
    
    async salvar(cliente: Cliente): Promise<void> {
        if(cliente?.id) {
            await this.colecao().doc(cliente.id).set(cliente)
        } else {
            const docRef = await this.colecao().add(cliente)
            const doc = await docRef.get()
            
        }
    }

    async excluir(cliente: Cliente): Promise<void> {
        return this.colecao().doc(cliente.id).delete()
    }

    async obterTodos(): Promise<Cliente[]> {
        const query = await this.colecao().get()
        return query.docs.map((doc: { data: () => any; }) => doc.data()) ?? []
    }

    private colecao() {
        return firestore.collection('clientes').withConverter(this.#conversor)
    }
}