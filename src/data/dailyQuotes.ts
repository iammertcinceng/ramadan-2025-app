export interface DailyQuote {
  id: number;
  type: 'hadis' | 'ayet' | 'dua' ;
  content: string;
  source: string;
}

export const dailyQuotes: DailyQuote[] = [
    { id: 1, type: 'hadis', content: 'Kim inanarak ve sevabını Allah\'tan bekleyerek Ramazan orucunu tutarsa, geçmiş günahları bağışlanır.', source: 'Buhârî, Îmân, 28' },
    { id: 2, type: 'ayet', content: 'Ey iman edenler! Oruç, sizden öncekilere farz kılındığı gibi size de farz kılındı. Umulur ki korunursunuz.', source: 'Bakara Suresi, 183' },
    { id: 3, type: 'hadis', content: 'Oruç bir kalkandır. Oruçlu, kötü söz söylemesin ve kavga etmesin. Eğer biri kendisiyle kavga etmek isterse, \"Ben oruçluyum\" desin.', source: 'Buhârî, Savm, 2' },
    { id: 4, type: 'ayet', content: 'Ramazan ayı, insanlara yol gösterici, doğrunun ve doğruyu eğriden ayırmanın açık delilleri olarak Kur\'an\'ın indirildiği aydır.', source: 'Bakara Suresi, 185' },
    { id: 5, type: 'dua', content: 'Allah\'ım! Senden, rızanı ve cenneti istiyorum. Gazabından ve cehennemden sana sığınırım.', source: 'İbn Mâce, Dua, 4' },
    { id: 6, type: 'hadis', content: 'Oruçlunun ağız kokusu, Allah katında misk kokusundan daha hoştur.', source: 'Buhârî, Savm, 9' },
    { id: 7, type: 'ayet', content: 'Şüphesiz, iyilikler kötülükleri giderir. Bu, öğüt alanlar için bir hatırlatmadır.', source: 'Hud Suresi, 114' },
    { id: 8, type: 'hadis', content: 'Cennette Reyyan denilen bir kapı vardır. Oruçlular kıyamet günü buradan çağrılır.', source: 'Buhârî, Savm, 4' },
    { id: 9, type: 'ayet', content: 'Rabbinizden mağfiret dileyin, sonra O\'na tevbe edin ki sizi belli bir vakte kadar güzel bir şekilde yaşatsın.', source: 'Hud Suresi, 3' },
    { id: 10, type: 'dua', content: 'Allah\'ım! Beni affet, bana merhamet et, bana doğru yolu göster, beni rızıklandır.', source: 'Müslim, Zikir, 35' },
    { id: 11, type: 'hadis', content: 'Kim Ramazan ayında bir oruçluyu iftar ettirirse, oruçlunun sevabı kadar sevap kazanır.', source: 'Tirmizî, Savm, 82' },
    { id: 12, type: 'ayet', content: 'Şüphesiz, Allah sabredenlerle beraberdir.', source: 'Bakara Suresi, 153' },
    { id: 13, type: 'dua', content: 'Ey kalpleri çeviren Allah! Kalbimi dinin üzere sabit kıl.', source: 'Tirmizî, Deavat, 89' },
    { id: 14, type: 'hadis', content: 'Müminin diğer mümine duası kabul olur. Bir Müslüman kardeşi için dua ederse, bir melek de \"Aynısı senin için de olsun\" der.', source: 'Müslim, Zikir, 86' },
    { id: 15, type: 'ayet', content: 'Her nefis ölümü tadacaktır. Sonunda bize döndürüleceksiniz.', source: 'Ankebut Suresi, 57' },
    { id: 16, type: 'dua', content: 'Allah\'ım! Senden faydalı ilim, helal rızık ve makbul amel istiyorum.', source: 'İbn Mâce, Dua, 5' },
    { id: 17, type: 'hadis', content: 'Kimin son sözü “Lâ ilâhe illallah” olursa, cennete girer.', source: 'Ebû Dâvûd, Cenaiz, 16' },
    { id: 18, type: 'ayet', content: 'Şüphesiz, Allah sadaka verenleri sever.', source: 'Bakara Suresi, 276' },
    { id: 19, type: 'dua', content: 'Ey Rabbimiz! Bize dünyada da ahirette de iyilik ver ve bizi ateş azabından koru.', source: 'Bakara Suresi, 201' },
    { id: 20, type: 'hadis', content: 'Bir müminin diktiği ağaçtan bir canlı yerse, bu ona sadaka olur.', source: 'Müslim, Müsâkât, 7' },
    { id: 21, type: 'ayet', content: 'Şüphesiz, her zorlukla beraber bir kolaylık vardır.', source: 'İnşirah Suresi, 6' },
    { id: 22, type: 'dua', content: 'Ey Allah! Benim için işimi kolaylaştır, zorlaştırma.', source: 'Müslim, Zikir, 35' },
    { id: 23, type: 'hadis', content: 'İnsanların en hayırlısı, insanlara en faydalı olandır.', source: 'Ahmed b. Hanbel, Müsned, 1/92' },
    { id: 24, type: 'ayet', content: 'Allah size adaleti, iyiliği ve akrabaya yardım etmeyi emreder.', source: 'Nahl Suresi, 90' },
    { id: 25, type: 'dua', content: 'Ey Rabbim! Bana ve ana-babama verdiğin nimete şükretmemi nasip et.', source: 'Neml Suresi, 19' },
    { id: 26, type: 'hadis', content: 'Komşusu açken tok yatan bizden değildir.', source: 'Müslim, İman, 74' },
    { id: 27, type: 'ayet', content: 'Şüphesiz, Allah adil olanları sever.', source: 'Hucurat Suresi, 9' },
    { id: 28, type: 'dua', content: 'Allah\'ım! Sen affedicisin, affetmeyi seversin, beni de affet.', source: 'Tirmizî, Deavat, 85' },
    { id: 29, type: 'hadis', content: 'Güzel söz sadakadır.', source: 'Buhârî, Edeb, 34' },
    { id: 30, type: 'ayet', content: 'Allah, sabredenleri sever.', source: 'Âl-i İmrân Suresi, 146' }
  ];
  