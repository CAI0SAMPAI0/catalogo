import json
import os
import urllib.parse
import urllib.request

TRACKS = [
    # --- MÚSICA CLÁSSICA (10) ---
    {
        "query": "Beethoven Symphony No 5 Karajan",
        "name": "Sinfonia Nº 5 em Dó Menor, Op. 67",
        "artist": "Ludwig van Beethoven",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1808-12-22",
        "desc": "O famoso motivo de quatro notas do 'destino batendo à porta' abre uma das peças orquestrais mais influentes e celebradas de toda a história da música ocidental.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven.jpg"
    },
    {
        "query": "Beethoven Moonlight Sonata Kempff",
        "name": "Sonata ao Luar (Op. 27, Nº 2)",
        "artist": "Ludwig van Beethoven",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1801-01-01",
        "desc": "Obra para piano solo em Dó sustenido menor, com seu primeiro movimento Adagio sostenuto de melancolia poética e clímax furioso no Presto agitato.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven.jpg"
    },
    {
        "query": "Beethoven Symphony 9 Ode to Joy Karajan",
        "name": "Ode à Alegria (Sinfonia Nº 9)",
        "artist": "Ludwig van Beethoven",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1824-05-07",
        "desc": "Composta quando Beethoven já estava completamente surdo, o movimento coral final é um hino universal à fraternidade humana baseado no poema de Schiller.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Beethoven.jpg"
    },
    {
        "query": "Mozart Requiem Lacrimosa Marriner",
        "name": "Requiem em Ré Menor: Lacrimosa",
        "artist": "Wolfgang Amadeus Mozart",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1791-12-05",
        "desc": "Missa fúnebre inacabada no leito de morte de Mozart. A seção Lacrimosa possui um lirismo trágico e comovente imortalizado na cultura ocidental.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg"
    },
    {
        "query": "Mozart Eine kleine Nachtmusik Marriner",
        "name": "Eine kleine Nachtmusik (K. 525)",
        "artist": "Wolfgang Amadeus Mozart",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1787-08-10",
        "desc": "Serenata nº 13 para cordas em Sol maior. Uma das composições mais alegres, elegantes e instantaneamente reconhecíveis da era clássica vienense.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Wolfgang-amadeus-mozart_1.jpg"
    },
    {
        "query": "Vivaldi Four Seasons Winter",
        "name": "As Quatro Estações: O Inverno (L'Inverno)",
        "artist": "Antonio Vivaldi",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1725-01-01",
        "desc": "Concerto barroco virtuoso em Fá menor que evoca com cordas cortantes o bater de dentes no gelo e a calmaria diante da lareira acolhedora.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg"
    },
    {
        "query": "Vivaldi Four Seasons Spring",
        "name": "As Quatro Estações: A Primavera (La Primavera)",
        "artist": "Antonio Vivaldi",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1725-01-01",
        "desc": "O despontar triunfante da estação das flores, com trinados de violinos imitando o canto dos pássaros e o murmúrio dos riachos cristalinos.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Vivaldi.jpg"
    },
    {
        "query": "Bach Toccata and Fugue in D Minor",
        "name": "Tocata e Fuga em Ré Menor (BWV 565)",
        "artist": "Johann Sebastian Bach",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1704-01-01",
        "desc": "A peça para órgão de tubos mais dramática e grandiosa da história da música sacra barroca, repleta de virtuosismo contrapontístico gótico.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Johann_Sebastian_Bach.jpg"
    },
    {
        "query": "Chopin Nocturne Op 9 No 2 Rubinstein",
        "name": "Noturno em Mi Bemol Maior, Op. 9 Nº 2",
        "artist": "Frédéric Chopin",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1832-01-01",
        "desc": "A quintessência do romantismo pianístico de Chopin, caracterizada por melodia de beleza serena na mão direita e arpejos suaves na esquerda.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg"
    },
    {
        "query": "Debussy Clair de Lune Suite bergamasque",
        "name": "Clair de Lune (Suite Bergamasque)",
        "artist": "Claude Debussy",
        "type": "Clássica",
        "genre": "Música Clássica",
        "release_date": "1905-01-01",
        "desc": "A obra-prima do impressionismo musical francês inspirada na poesia de Paul Verlaine, pintando a luz prateada da lua com texturas harmônicas fluidas.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Claude_Debussy_atelier_Nadar.jpg"
    },

    # --- ROCK / METAL / NU METAL (20) ---
    # Evanescence (4)
    {
        "query": "Evanescence Fallen",
        "name": "Bring Me to Life",
        "artist": "Evanescence",
        "type": "Rock",
        "genre": "Rock Gótico / Metal Alternativo",
        "release_date": "2003-03-04",
        "desc": "O mega hit que definiu uma geração, unindo piano clássico, riffs pesados de guitarra e o vocal potente e arrebatador de Amy Lee.",
        "fallback_cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/10/4c/21/104c21e6-9ef0-4d3a-d1bd-d47167f121e5/00601501406300.rgb.jpg/600x600bb.jpg"
    },
    {
        "query": "Evanescence Fallen",
        "name": "My Immortal",
        "artist": "Evanescence",
        "type": "Rock",
        "genre": "Rock Gótico",
        "release_date": "2003-12-08",
        "desc": "Balada gótica profundamente emotiva construída em piano solo e orquestra de cordas, explorando a dor insuperável da perda.",
        "fallback_cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/10/4c/21/104c21e6-9ef0-4d3a-d1bd-d47167f121e5/00601501406300.rgb.jpg/600x600bb.jpg"
    },
    {
        "query": "Evanescence Fallen",
        "name": "Going Under",
        "artist": "Evanescence",
        "type": "Rock",
        "genre": "Metal Alternativo",
        "release_date": "2003-09-09",
        "desc": "Faixa de abertura visceral de Fallen, com baixo marcante, guitarras afinadas em drop e letra catártica sobre superar relacionamentos abusivos.",
        "fallback_cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/10/4c/21/104c21e6-9ef0-4d3a-d1bd-d47167f121e5/00601501406300.rgb.jpg/600x600bb.jpg"
    },
    {
        "query": "Evanescence The Open Door",
        "name": "Lithium",
        "artist": "Evanescence",
        "type": "Rock",
        "genre": "Rock Alternativo",
        "release_date": "2006-10-03",
        "desc": "Composição introspectiva que utiliza o elemento lítio como metáfora para a anestesia emocional e o medo de voltar a sentir a tristeza.",
        "fallback_cover": ""
    },
    # Metallica (5)
    {
        "query": "Metallica Master of Puppets",
        "name": "Master of Puppets",
        "artist": "Metallica",
        "type": "Rock",
        "genre": "Thrash Metal",
        "release_date": "1986-03-03",
        "desc": "Considerada por críticos e fãs a obra-prima absoluta do thrash metal, uma suíte de 8 minutos com palhetadas rápidas em downpicking e solos impecáveis de Kirk Hammett.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg"
    },
    {
        "query": "Metallica The Black Album Remastered",
        "name": "Enter Sandman",
        "artist": "Metallica",
        "type": "Rock",
        "genre": "Heavy Metal",
        "release_date": "1991-07-29",
        "desc": "Um dos riffs de guitarra mais famosos e reverenciados da história do rock, abordando os pesadelos infantis com produção monstruosa de Bob Rock.",
        "fallback_cover": ""
    },
    {
        "query": "Metallica And Justice for All Remastered",
        "name": "One",
        "artist": "Metallica",
        "type": "Rock",
        "genre": "Thrash Metal",
        "release_date": "1988-08-25",
        "desc": "Inspirada no romance anti-guerra Johnny Vai à Guerra, transita de uma balada acústica melancólica para uma tempestade de bumbo duplo simulando metralhadoras.",
        "fallback_cover": ""
    },
    {
        "query": "Metallica The Black Album Remastered",
        "name": "Nothing Else Matters",
        "artist": "Metallica",
        "type": "Rock",
        "genre": "Heavy Metal / Balada",
        "release_date": "1992-04-20",
        "desc": "A mais famosa balada do metal mundial, escrita por James Hetfield em um quarto de hotel e ornamentada com arranjos sinfônicos de Michael Kamen.",
        "fallback_cover": ""
    },
    {
        "query": "Metallica Ride the Lightning Remastered",
        "name": "Fade to Black",
        "artist": "Metallica",
        "type": "Rock",
        "genre": "Thrash Metal",
        "release_date": "1984-07-27",
        "desc": "A primeira 'power ballad' do Metallica, célebre pela alternância entre dedilhados acústicos sombrios e um solo final elétrico considerado um dos maiores da história.",
        "fallback_cover": ""
    },
    # Guns N' Roses (4)
    {
        "query": "Guns N Roses Appetite for Destruction",
        "name": "Sweet Child O' Mine",
        "artist": "Guns N' Roses",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1987-07-21",
        "desc": "Com o lendário riff introdutório circular de Slash em Ré bemol e o vocal estridente e apaixonado de Axl Rose, alcançou o 1º lugar na Billboard Hot 100.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg"
    },
    {
        "query": "Guns N Roses Use Your Illusion I",
        "name": "November Rain",
        "artist": "Guns N' Roses",
        "type": "Rock",
        "genre": "Hard Rock / Rock Sinfônico",
        "release_date": "1991-09-17",
        "desc": "Um épico orquestral cinematográfico de quase nove minutos com piano dramático de Axl Rose e o icônico solo de Slash em frente à igreja no deserto.",
        "fallback_cover": ""
    },
    {
        "query": "Guns N Roses Appetite for Destruction",
        "name": "Welcome to the Jungle",
        "artist": "Guns N' Roses",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1987-10-03",
        "desc": "O hino cru e explosivo do submundo de Los Angeles, narrando com selvageria a chegada de jovens inocentes à 'selva' urbana da Califórnia.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg"
    },
    {
        "query": "Guns N Roses Appetite for Destruction",
        "name": "Paradise City",
        "artist": "Guns N' Roses",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1987-07-21",
        "desc": "Famosa pela transição do refrão festivo de estádio com apito para um dos finais mais acelerados e enérgicos do rock dos anos 80.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/en/6/60/GunsnRosesAppetiteforDestructionalbumcover.jpg"
    },
    # AC/DC (4)
    {
        "query": "AC DC Back in Black",
        "name": "Back in Black",
        "artist": "AC/DC",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1980-07-25",
        "desc": "Tributo triunfante ao falecido vocalista Bon Scott, apresentando Brian Johnson e o riff em Mi Maior de Angus Young que é sinônimo do puro rock n' roll.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/3/3e/ACDC_Back_in_Black_cover.svg"
    },
    {
        "query": "AC DC Highway to Hell",
        "name": "Highway to Hell",
        "artist": "AC/DC",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1979-07-27",
        "desc": "O último grande clássico gravado com Bon Scott, celebrando a vida implacável na estrada com ritmo sincopado e energia inabalável.",
        "fallback_cover": ""
    },
    {
        "query": "AC DC The Razors Edge",
        "name": "Thunderstruck",
        "artist": "AC/DC",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1990-09-10",
        "desc": "Abertura com o inconfundível dedilhado com ligaduras (hammer-ons e pull-offs) executado por Angus Young em apenas uma corda da guitarra.",
        "fallback_cover": ""
    },
    {
        "query": "AC DC Back in Black",
        "name": "Hells Bells",
        "artist": "AC/DC",
        "type": "Rock",
        "genre": "Hard Rock",
        "release_date": "1980-10-31",
        "desc": "As quatro badaladas do sino fúnebre de bronze de duas toneladas dão início a uma das faixas mais soturnas e pesadas do rock clássico.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/commons/3/3e/ACDC_Back_in_Black_cover.svg"
    },
    # Linkin Park (3)
    {
        "query": "Linkin Park Hybrid Theory",
        "name": "In the End",
        "artist": "Linkin Park",
        "type": "Rock",
        "genre": "Nu Metal / Rock Alternativo",
        "release_date": "2000-10-24",
        "desc": "A simbiose perfeita entre as rimas de Mike Shinoda e o refrão cortante e catártico de Chester Bennington, ultrapassando bilhões de reproduções.",
        "fallback_cover": "https://upload.wikimedia.org/wikipedia/en/2/2a/Linkin_Park_Hybrid_Theory_Album_Cover.jpg"
    },
    {
        "query": "Linkin Park Meteora",
        "name": "Numb",
        "artist": "Linkin Park",
        "type": "Rock",
        "genre": "Nu Metal / Rock Alternativo",
        "release_date": "2003-03-25",
        "desc": "O hino geracional sobre a pressão das expectativas e o anseio por identidade própria, sustentado por teclados melancólicos e guitarras pesadas.",
        "fallback_cover": ""
    },
    {
        "query": "Linkin Park Meteora",
        "name": "Faint",
        "artist": "Linkin Park",
        "type": "Rock",
        "genre": "Nu Metal",
        "release_date": "2003-03-25",
        "desc": "Velocidade furiosa, arranjo de cordas clássicas em alta rotação e o grito gutural 'I won't be ignored!' de Chester Bennington.",
        "fallback_cover": ""
    },

    # --- MPB - MÚSICA POPULAR BRASILEIRA (20) ---
    {
        "query": "Elis Regina Tom Jobim Elis Tom",
        "name": "Águas de Março",
        "artist": "Tom Jobim & Elis Regina",
        "type": "MPB",
        "genre": "MPB / Bossa Nova",
        "release_date": "1974-05-01",
        "desc": "Aclamada pela revista Rolling Stone como a maior música brasileira de todos os tempos, uma conversa poética e risonha entre dois gigantes da nossa cultura.",
        "fallback_cover": ""
    },
    {
        "query": "Chico Buarque Construcao",
        "name": "Construção",
        "artist": "Chico Buarque",
        "type": "MPB",
        "genre": "MPB",
        "release_date": "1971-01-01",
        "desc": "Monumento da engenharia lírica da língua portuguesa, onde todos os versos dodecassílabos terminam com palavras proparoxítonas, narrando a tragédia de um operário.",
        "fallback_cover": ""
    },
    {
        "query": "Cartola 1976",
        "name": "O Mundo É um Moinho",
        "artist": "Cartola",
        "type": "MPB",
        "genre": "Samba / MPB",
        "release_date": "1976-01-01",
        "desc": "Conselho paternal de extrema sensibilidade e dor poética composto por Cartola para sua filha adotiva Creusa na alvorada da juventude.",
        "fallback_cover": ""
    },
    {
        "query": "Cartola 1976",
        "name": "As Rosas Não Falam",
        "artist": "Cartola",
        "type": "MPB",
        "genre": "Samba / MPB",
        "release_date": "1976-01-01",
        "desc": "'Bate outra vez com esperança o meu coração'. Poesia lírica de Mangueira gravada na voz suave e melancólica do Mestre Cartola.",
        "fallback_cover": ""
    },
    {
        "query": "Elis Regina Falso Brilhante",
        "name": "Como Nossos Pais",
        "artist": "Elis Regina",
        "type": "MPB",
        "genre": "MPB",
        "release_date": "1976-01-01",
        "desc": "Composta por Belchior e imortalizada na interpretação vulcânica de Elis Regina, retrata o choque geracional e as dores da ditadura militar no Brasil.",
        "fallback_cover": ""
    },
    {
        "query": "Belchior Alucinacao",
        "name": "Apenas um Rapaz Latino-Americano",
        "artist": "Belchior",
        "type": "MPB",
        "genre": "MPB / Folk Brasileiro",
        "release_date": "1976-01-01",
        "desc": "O manifesto cortante de Belchior contra o idealismo dos anos 60, cantando a realidade crua de quem veio do interior 'sem dinheiro no banco e sem parentes importantes'.",
        "fallback_cover": ""
    },
    {
        "query": "Tim Maia 1971 Nao Quero Dinheiro",
        "name": "Não Quero Dinheiro (Só Quero Amar)",
        "artist": "Tim Maia",
        "type": "MPB",
        "genre": "Soul / Funk Soul / MPB",
        "release_date": "1971-01-01",
        "desc": "Pura euforia dançante com metais brilhantes do Síndico do Brasil, celebrando o amor acima de qualquer ambição material.",
        "fallback_cover": ""
    },
    {
        "query": "Tim Maia 1973 Gostava Tanto de Voce",
        "name": "Gostava Tanto de Você",
        "artist": "Tim Maia",
        "type": "MPB",
        "genre": "Soul Brasileiro / MPB",
        "release_date": "1973-01-01",
        "desc": "Composta por Edson Trindade, a interpretação cheia de 'soul' e saudade de Tim Maia tornou esta faixa uma das baladas mais queridas da música nacional.",
        "fallback_cover": ""
    },
    {
        "query": "Milton Nascimento Travessia",
        "name": "Travessia",
        "artist": "Milton Nascimento",
        "type": "MPB",
        "genre": "MPB",
        "release_date": "1967-01-01",
        "desc": "Apresentou a voz celestial e inconfundível de Bituca ao mundo, com harmonia monumental de Fernando Brant sobre superação e renascimento.",
        "fallback_cover": ""
    },
    {
        "query": "Milton Nascimento Clube da Esquina",
        "name": "Clube da Esquina Nº 2",
        "artist": "Milton Nascimento & Lô Borges",
        "type": "MPB",
        "genre": "MPB / Clube da Esquina",
        "release_date": "1972-01-01",
        "desc": "A sublime fusão mineira de Beatles, bossa nova e música barroca das Gerais, evocando amizade, montanhas e sonhos de liberdade.",
        "fallback_cover": ""
    },
    {
        "query": "Caetano Veloso 1968 Alegria Alegria",
        "name": "Alegria, Alegria",
        "artist": "Caetano Veloso",
        "type": "MPB",
        "genre": "Tropicália / MPB",
        "release_date": "1968-01-01",
        "desc": "O marco zero da Tropicália no III Festival de Música Popular Brasileira, misturando guitarras elétricas dos Beat Boys com poesia pop urbana.",
        "fallback_cover": ""
    },
    {
        "query": "Caetano Veloso Cores Nomes Voce e Linda",
        "name": "Você É Linda",
        "artist": "Caetano Veloso",
        "type": "MPB",
        "genre": "MPB",
        "release_date": "1982-01-01",
        "desc": "Declaração de amor lírica da MPB inspirada em Salvador, com versos que exaltam a beleza luminosa e a poesia do mar da Bahia.",
        "fallback_cover": ""
    },
    {
        "query": "Gilberto Gil 1969 Aquele Abraco",
        "name": "Aquele Abraço",
        "artist": "Gilberto Gil",
        "type": "MPB",
        "genre": "Samba / MPB",
        "release_date": "1969-01-01",
        "desc": "Composta pouco antes de Gil partir para o exílio em Londres, um hino ensolarado de despedida e amor à cidade do Rio de Janeiro.",
        "fallback_cover": ""
    },
    {
        "query": "Gilberto Gil Realce Nao Chore Mais",
        "name": "Não Chore Mais (No Woman, No Cry)",
        "artist": "Gilberto Gil",
        "type": "MPB",
        "genre": "Reggae / MPB",
        "release_date": "1979-01-01",
        "desc": "Versão magistral do clássico de Bob Marley que introduziu o reggae em escala massiva no Brasil, simbolizando o clamor pela Anistia.",
        "fallback_cover": ""
    },
    {
        "query": "Jorge Ben Samba Esquema Novo Mas Que Nada",
        "name": "Mas que Nada",
        "artist": "Jorge Ben Jor",
        "type": "MPB",
        "genre": "Samba Rock / MPB",
        "release_date": "1963-01-01",
        "desc": "A batida pioneira de violão sincopado de Jorge Ben que fundou o samba-rock e rodou o planeta, sendo gravada por Sergio Mendes e Black Eyed Peas.",
        "fallback_cover": ""
    },
    {
        "query": "Jorge Ben Ben Taj Mahal",
        "name": "Taj Mahal",
        "artist": "Jorge Ben Jor",
        "type": "MPB",
        "genre": "Samba Rock",
        "release_date": "1972-01-01",
        "desc": "Groove hipnótico e história de amor do imperador Shah Jahan que inspirou o célebre monumento indiano e tornou-se patrimônio das festas brasileiras.",
        "fallback_cover": ""
    },
    {
        "query": "Djavan Djavan Oceano",
        "name": "Oceano",
        "artist": "Djavan",
        "type": "MPB",
        "genre": "MPB",
        "release_date": "1989-01-01",
        "desc": "Arranjo sofisticado com solo de violão flamenco de Paco de Lucía e melodia arrebatadora que se tornou uma das canções mais cantadas da MPB.",
        "fallback_cover": ""
    },
    {
        "query": "Djavan Luz Sina",
        "name": "Sina",
        "artist": "Djavan",
        "type": "MPB",
        "genre": "MPB / Pop",
        "release_date": "1982-01-01",
        "desc": "'O luar, estrela do mar... Você me desinibe'. Com o famoso verso 'caetanear o que há de bom', uma celebração de ritmo e poesia sincopada.",
        "fallback_cover": ""
    },
    {
        "query": "Alceu Valenca Anjo Avesso Anunciacao",
        "name": "Anunciação",
        "artist": "Alceu Valença",
        "type": "MPB",
        "genre": "Frevo / Forró / MPB",
        "release_date": "1983-01-01",
        "desc": "'A voz do anjo sussurrou no meu ouvido...'. Hino nordestino com flautas mágicas e ritmo vibrante que une multidões de todas as gerações.",
        "fallback_cover": ""
    },
    {
        "query": "Raul Seixas Krig ha Bandolo Metamorfose",
        "name": "Metamorfose Ambulante",
        "artist": "Raul Seixas",
        "type": "Rock / MPB",
        "genre": "Rock Brasileiro / MPB",
        "release_date": "1973-05-14",
        "desc": "O manifesto libertário do Maluco Beleza contra o conformismo social: 'Eu prefiro ser essa metamorfose ambulante do que ter aquela velha opinião formada sobre tudo'.",
        "fallback_cover": ""
    }
]

print(f"Total de faixas preparadas: {len(TRACKS)}")

def fetch_itunes_cover(query):
    q = urllib.parse.quote(query)
    # Tenta como álbum primeiro
    url = f"https://itunes.apple.com/search?term={q}&entity=album&limit=1"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data["resultCount"] > 0:
                raw_art = data["results"][0].get("artworkUrl100", "")
                if raw_art:
                    return raw_art.replace("100x100bb.jpg", "600x600bb.jpg")
    except Exception as e:
        print(f"Error album query {query}: {e}")
    
    # Fallback para faixa individual
    url_song = f"https://itunes.apple.com/search?term={q}&entity=song&limit=1"
    try:
        req = urllib.request.Request(url_song, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data["resultCount"] > 0:
                raw_art = data["results"][0].get("artworkUrl100", "")
                if raw_art:
                    return raw_art.replace("100x100bb.jpg", "600x600bb.jpg")
    except Exception as e:
        print(f"Error song query {query}: {e}")

    return ""

results = []
for idx, t in enumerate(TRACKS, 1):
    art = fetch_itunes_cover(t["query"])
    if not art:
        art = t.get("fallback_cover") or "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=800&fit=crop"
    
    entry = {
        "id": idx,
        "name": t["name"],
        "artist": t["artist"],
        "type": t["type"],
        "genre": t["genre"],
        "release_date": t["release_date"],
        "description": t["desc"],
        "cover_url": art,
        "images": [art],
        "platforms": ["Spotify", "Apple Music", "YouTube Music", "Deezer", "Vinil"]
    }
    results.append(entry)
    print(f"[{idx}/50] {entry['name']} - {entry['artist']} -> {art[:65]}...")

out_path = os.path.join(os.path.dirname(__file__), "musics_50.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSalvo com sucesso em: {out_path} ({len(results)} faixas)")
