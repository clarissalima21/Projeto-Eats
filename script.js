// Seleciona todos os grupos
const grupos = document.querySelectorAll('.menu');

// Seleciona o botão
const botao = document.querySelector('.fecharpedido');

// Função para verificar se todos os grupos têm um item selecionado
function verificarSelecao() {
    let todosSelecionados = true;

    grupos.forEach(menu => {
        const selecionado = menu.querySelector('.itemselect');
        if (!selecionado) {
            todosSelecionados = false;
        }
    });

    // Se todos os itens estiverem selecionados, habilita o botão
    if (todosSelecionados) {
        botao.disabled = false;
        botao.classList.add('habilitado');
        botao.innerText = "Fechar pedido";
    } else {
        botao.disabled = true;
        botao.classList.remove('habilitado');
    }
}

// Função para garantir que só um item por grupo seja selecionado
grupos.forEach(menu => {
    const itens = menu.querySelectorAll('.item');

    itens.forEach(item => {
        item.addEventListener('click', function() {
            // Remove a seleção de todos os itens do grupo
            itens.forEach(i => i.classList.remove('itemselect'));

            // Adiciona a seleção ao item clicado
            this.classList.add('itemselect');

            // Verifica se todos os itens foram selecionados após o clique
            verificarSelecao();
        });
    });
});

// Função para finalizar o pagamento e mostrar os itens selecionados
function finalizarpagamento() {
    const painel = document.querySelector('.telabranca');
    if (painel) {
        painel.classList.remove('escondido');
        
        // Limpa o conteúdo antigo, se houver
        const confirmar = painel.querySelector('.confirmar');
        confirmar.innerHTML = "Confirme seu pedido:<br>";

        // Variável para armazenar o total
        let total = 0;
        let prato = "", bebida = "", sobremesa = "";

        // Adiciona os itens selecionados ao painel de finalização
        grupos.forEach(menu => {
            const itemSelecionado = menu.querySelector('.itemselect .nomeitem');
            const precoSelecionado = menu.querySelector('.itemselect .valor');

            if (itemSelecionado && precoSelecionado) {
                const preco = parseFloat(precoSelecionado.innerText.replace(",", "."));
                total += preco;

                // Verifica qual grupo está sendo iterado (prato, bebida, sobremesa)
                if (menu.id === "comida") {
                    prato = itemSelecionado.innerText;
                } else if (menu.id === "bebida") {
                    bebida = itemSelecionado.innerText;
                } else if (menu.id === "sobremesa") {
                    sobremesa = itemSelecionado.innerText;
                }

                confirmar.innerHTML += `${itemSelecionado.innerText} : ${precoSelecionado.innerText}<br>`;
            }
        });

        confirmar.innerHTML += `<br><strong>Total: ${total.toFixed(2).replace(".", ",")}</strong>`;

        // Adiciona evento ao botão de confirmar
        const botaoConfirmar = document.querySelector('.comprar');
        botaoConfirmar.onclick = function() {
            enviarPedidoWhatsApp(prato, bebida, sobremesa, total);
        };
    }
}

// Função para enviar o pedido via WhatsApp
function enviarPedidoWhatsApp(prato, bebida, sobremesa, total) {
    const numero = "5521985767404";
    const mensagem = `Olá, gostaria de fazer o pedido:
- Prato: ${prato}
- Bebida: ${bebida}
- Sobremesa: ${sobremesa}
Total: R$ ${total.toFixed(2).replace(".", ",")}`;

    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(mensagem)}`;

    // Redireciona para o WhatsApp com a mensagem
    window.open(url, '_blank');
}

// Função para cancelar o pedido
function cancelarpedido() {
    const painel = document.querySelector('.telabranca');
    if (painel) {
        painel.classList.add('escondido');
    }
}
