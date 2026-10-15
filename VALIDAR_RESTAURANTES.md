# Validar restaurantes

Lista de **64 restaurantes** para conferência manual. **Nenhum item foi marcado como verificado** (`"verificado": false` em `src/data/restaurantes.json`).

## Como conferir
Para cada linha, confirme no Google Maps (ou no Instagram do lugar): (1) o lugar existe e está aberto; (2) o endereço e o bairro; (3) a faixa de preço; (4) os pratos sugeridos. Marque a caixa quando estiver ok e avise o maestro para ajustar o JSON.

## Avisos sobre a qualidade dos dados
- Os restaurantes vieram de guias e listas públicas de Fortaleza (Tem que Ir, Saipos, Caminhos Me Levem, Conexão 085, TripAdvisor e similares). Há divergências entre fontes; elas estão na coluna *Observações*.
- **Coordenadas são aproximadas**: obtidas pelo nome da rua no OpenStreetMap (sem número da porta) ou, quando não achou a rua, pelo centro do bairro. Isso serve para a distância "aproximada" do app, mas não para navegação exata.
- **Faixa de preço** ($ a $$$$) foi estimada, não vem de fonte oficial.
- **Horários**: só entram quando uma fonte informou. Sem horário, o app não filtra por "aberto agora".
- **Pratos**: quando a observação diz "genérico", o prato é típico da categoria e não do cardápio da casa. Vale trocar por um prato real.
- Ficaram de fora lugares sem endereço identificável. A meta de ~100 não foi atingida de propósito, para não incluir dados duvidosos.

## Lista

| ✔ | Nome | Bairro | Endereço | Preço | Categorias | Observações |
|---|------|--------|----------|-------|------------|-------------|
| ☐ | Cantinho do Frango | Aldeota | Rua Torres Câmara, 71 | $$ | regional | Uma fonte cita o bairro Meireles; confirmar o bairro |
| ☐ | Casa Pâine | Aldeota | Av. Santos Dumont, 938 | $$ | café, doces | Pratos genéricos |
| ☐ | Era Uma Vez Dessert and Cakes | Aldeota | Av. Senador Virgílio Távora, 1837 B | $$ | doces, café | — |
| ☐ | Floresta Bar | Aldeota | Av. Santos Dumont, 1788 | $$ | bar | Outra fonte cita o bairro Varjota; pratos genéricos |
| ☐ | Fuji Sushi Lounge | Aldeota | Rua Leonardo Mota, 774 | $$$ | japonesa | Pratos genéricos |
| ☐ | GranoLeve | Aldeota | Rua Bárbara de Alencar, 1805 B | $$ | saudável | Pratos genéricos |
| ☐ | Hey Joe Food 'n' Bar | Aldeota | Rua Norvinda Pires, 32 | $$$ | contemporânea, bar | Pratos genéricos |
| ☐ | Jango Burger | Aldeota | Rua Joaquim Nabuco, 1273 | $$ | hambúrguer | — |
| ☐ | Jardim do Alchymist | Aldeota | Rua Barão de Aracati, 801 | $$$ | contemporânea, italiana | Pratos genéricos |
| ☐ | Kenji Sushi Bar | Aldeota | Rua Frederico Borges, 220 | $$$$ | japonesa | Rua citada fica na Varjota; confirmar bairro |
| ☐ | Mangue Azul | Aldeota | Rua Professor Dias da Rocha, 987 | $$$$ | regional, contemporânea | — |
| ☐ | Matsuri Sushi | Aldeota | Av. Dom Luís, 500 | $$$ | japonesa | Pratos genéricos |
| ☐ | Guaraná da Gorete | Benfica | Benfica (endereço a confirmar) | $ | doces, café | Endereço não informado na fonte |
| ☐ | Pimenta Vegana | Benfica | Rua Confúcio Pamplona, 339 | $ | vegetariana, saudável | Pratos genéricos |
| ☐ | Leão do Sul | Centro | Praça do Ferreira | $ | regional | Endereço aproximado (praça); confirmar número |
| ☐ | Mocinha do Mercado | Centro | Mercado Central de Fortaleza, Av. Alberto Nepomuceno | $ | regional | Box dentro do Mercado Central; confirmar número do box e endereço |
| ☐ | Self-service Regina Diógenes | Cocó | Cocó (endereço a confirmar) | $$ | regional | Endereço não informado na fonte; jantar também citado, horários só de almoço |
| ☐ | Vistta Rooftop | Cocó | Av. Santos Dumont, 6740, 22º andar | $$$$ | japonesa, contemporânea | Pratos genéricos; vista panorâmica citada |
| ☐ | Amicis Pizzaria | Dionísio Torres | Rua Osvaldo Cruz, 2085 | $$ | pizza | — |
| ☐ | Casa Nostra | Dionísio Torres | Av. Senador Virgílio Távora, 1800 | $$$ | italiana | Pratos genéricos |
| ☐ | Empire Pizza & Sub's | Dionísio Torres | Av. Senador Virgílio Távora, 1055, Loja 10 | $$ | pizza | Outra fonte atribui o mesmo endereço a outra pizzaria |
| ☐ | NBS Burger | Dionísio Torres | Rua Beni Carvalho, 677 | $$ | hambúrguer, pizza | Aberto 24h segundo o site da rede |
| ☐ | Pizza do Frei | Dionísio Torres | Av. Pontes Vieira, 1127 | $$ | pizza | Unidade "Aldeota Express"; confirmar |
| ☐ | Pizzaria Fornalha | Dionísio Torres | Rua Vicente Leite, 2999 | $$ | pizza | Prato genérico; forno a lenha não confirmado |
| ☐ | Marcão das Ostras | Joaquim Távora | Rua Professor Carvalho, 2901 | $$ | frutos do mar | Bairro conforme a fonte; confirmar |
| ☐ | Atelier 1913 | Meireles | Rua Antônio Augusto, 744 | $$ | café, doces | — |
| ☐ | Balcone | Meireles | Rua Osvaldo Cruz, 919 | $$$ | contemporânea | Pratos genéricos |
| ☐ | CACAO | Meireles | Rua José Vilar, 1520 A | $$ | doces | Tipo de estabelecimento a confirmar |
| ☐ | Coco Bambu Beira Mar | Meireles | Av. Beira Mar, 3698 | $$$ | frutos do mar, regional | Fontes divergem: também citado em Rua Canuto de Aguiar, 1317; rede com várias unidades |
| ☐ | Conimaki Sushi | Meireles | Rua Canuto de Aguiar, 1368 | $$$ | japonesa | Pratos genéricos |
| ☐ | Cortile Ristorante | Meireles | Rua Vicente Leite, 520 | $$$ | italiana | Outra fonte atribui este mesmo endereço a outro restaurante; confirmar com cuidado |
| ☐ | Geppos Beira Mar | Meireles | Av. Beira Mar, 3222 | $$$ | italiana | Uma fonte cita o bairro Praia de Iracema; pratos genéricos |
| ☐ | Geppos Jardins | Meireles | Av. Desembargador Moreira, 1011 | $$$ | italiana | Pratos genéricos da categoria |
| ☐ | Illa Mare | Meireles | Av. Beira Mar, 3821 | $$$$ | frutos do mar, contemporânea | Pratos genéricos, não confirmados |
| ☐ | Let's Fit | Meireles | Rua Edgar Damasceno, 56 | $$ | saudável | Pratos genéricos |
| ☐ | Mandir | Meireles | Rua Frei Mansueto, 1130 | $$ | vegetariana | Uma fonte associa ao Benfica; pratos genéricos |
| ☐ | Nato Confeitaria Saudável | Meireles | Rua Tibúrcio Cavalcante, 1656 | $$ | doces, saudável | Pratos genéricos |
| ☐ | Porpino Burger | Meireles | Av. Senador Virgílio Távora, 597 | $$ | hambúrguer | Bairro a confirmar |
| ☐ | Ryori Sushi Lounge | Meireles | Av. Dom Luís, 1113 | $$$ | japonesa | Pratos genéricos |
| ☐ | Sabores Orgânicos | Meireles | Rua Monsenhor Bruno, 1300 | $$ | saudável | Pratos genéricos |
| ☐ | Tilápia Regional | Meireles | Rua Frei Mansueto, 458 | $$ | regional | Uma fonte cita o bairro Varjota; confirmar o bairro |
| ☐ | Vignoli | Meireles | Av. Senador Virgílio Távora, 10 | $$$ | pizza, italiana | Número do endereço e bairro a confirmar |
| ☐ | Vila Camaleão | Meireles | Av. Barão de Studart, 671 | $$ | bar | Bairro a confirmar; pratos genéricos |
| ☐ | Zaiko Sushi | Meireles | Rua Ana Bilhar, 1136 A | $$$ | japonesa | — |
| ☐ | Centro das Tapioqueiras | Messejana | Av. Washington Soares, 10425 | $ | regional, doces | — |
| ☐ | O Parente | Messejana | Mercado de Messejana | $ | regional | Endereço é o do mercado; pratos genéricos da culinária nordestina, não confirmados |
| ☐ | Sabor do Mercado | Messejana | Mercado de Messejana | $ | regional | Endereço é o do mercado; pratos genéricos, não confirmados |
| ☐ | La Vilani | Mucuripe | Rua Olga Barroso, 331 | $$ | frutos do mar, regional | Pratos genéricos de frutos do mar, não confirmados |
| ☐ | Mercado dos Peixes do Mucuripe | Mucuripe | Av. Beira Mar, 3479 | $$ | frutos do mar | Compra o pescado e leva para os quiosques; pratos genéricos |
| ☐ | Restaurante Mucuripe | Mucuripe | Av. Beira Mar, 3980 | $$$ | frutos do mar | Pratos genéricos, não confirmados |
| ☐ | Sorveteria 50 Sabores | Mucuripe | Av. Beira Mar, 4050 | $ | doces | Sabores citados pela fonte como regionais; confirmar |
| ☐ | Terral do Marujo | Mucuripe | Av. da Abolição, 5470 | $$ | frutos do mar | Bairro inferido pela fonte; confirmar |
| ☐ | Camarada Camarão | Papicu | Rua Desembargador Lauro Nogueira, 1500 | $$ | frutos do mar | Rede de restaurantes; confirmar unidade |
| ☐ | Churrascaria Gheller | Praia de Iracema | Av. Monsenhor Tabosa, 825 | $$$ | churrasco | — |
| ☐ | L'ô Restaurante | Praia de Iracema | Av. Pessoa Anta, 217 | $$$$ | contemporânea, frutos do mar | — |
| ☐ | Moranga Bistrô | Praia de Iracema | Rua Xavier de Castro, 100 | $$$$ | contemporânea, frutos do mar | — |
| ☐ | Pirata Bar | Praia de Iracema | Rua dos Tabajaras, 325 | $$ | bar | Famoso pelas segundas-feiras; pratos genéricos |
| ☐ | Restaurante Brazão | Praia de Iracema | Rua João Cordeiro, 43 | $$ | regional | Pratos genéricos da culinária cearense, não confirmados com o cardápio |
| ☐ | Teresa e Jorge | Praia de Iracema | Rua João Cordeiro, 540 | $$ | bar | Pratos genéricos; samba ao vivo citado |
| ☐ | Chico do Caranguejo | Praia do Futuro | Praia do Futuro (endereço a confirmar) | $$$ | frutos do mar, regional | Barraca na Praia do Futuro; uma fonte cita também Av. Barão de Studart, 1071 (Aldeota) |
| ☐ | Tempero do Mangue | Sabiaguaba | Rua Valdir Bezerra, 100 | $$ | regional, frutos do mar | Pratos genéricos, não confirmados |
| ☐ | Assis o Rei da Picanha | Varjota | Rua Ana Bilhar, 1356 | $$ | churrasco | Fonte também cita frutos do mar |
| ☐ | Carneiro do Ordones | Varjota | Rua Frederico Borges, 368 | $$ | churrasco | Prato genérico; possui outra unidade em Parquelândia |
| ☐ | Quintal da Varjota | Varjota | Av. Antônio Justa, 3525 | $$ | regional, bar | Fonte cita o bairro Meireles; pratos genéricos |
