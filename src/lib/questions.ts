export type QuizQuestionStep = {
  id: string;
  type: 'question';
  kind: 'single' | 'multi';
  title: string;
  helper?: string;
  options: { id: string; label: string }[];
};

export type QuizInfoStep = {
  id: string;
  type: 'info';
  title?: string;
  body: string[];
  image?: string;
};

export type QuizStep = QuizQuestionStep | QuizInfoStep;

type RawQuestionStep = {
  id: string;
  type: 'question';
  kind: 'single' | 'multi';
  title: string;
  note?: string;
  options: string[];
};

type RawInfoStep = {
  id: string;
  type: 'info';
  title?: string;
  body?: string[];
  image?: string;
};

type RawStep = RawQuestionStep | RawInfoStep;

const RAW_STEPS: RawStep[] = [
  {
    id: 's1',
    type: 'question',
    kind: 'single',
    title: 'Cinsiyetin nedir?',
    options: ['Erkek', 'Kadın', 'Belirtmek istemiyorum'],
  },
  {
    id: 's2',
    type: 'question',
    kind: 'single',
    title: 'Yaş aralığın nedir?',
    options: ['18–24', '25–34', '35–44', '45+'],
  },
  {
    id: 's3',
    type: 'question',
    kind: 'single',
    title: 'Sigarayı bırakmayı ne zamandır istiyorsun?',
    options: ['0-6 aydır', '6-12 aydır', '1-5 yıldır', '5 yıldan uzun süredir'],
  },
  {
    id: 's4',
    type: 'question',
    kind: 'multi',
    title: 'Sigarayı neden bırakmak istiyorsun?',
    note: '(Çoklu seçim yapabilirsin.)',
    options: [
      'Şimdi bırakmaya hazır olduğum için',
      'Bu hissi yaşamaktan yorulduğum için',
      'Sevdiklerim için',
      'Paramın cebimde kalması için',
      'Artık dayanamadığım için',
    ],
  },
  {
    id: 's5',
    type: 'info',
    image: '/illustrations/brain.svg',
    body: [
      'İnsanlar dopamin salgısı tetiklendiği için sigarayı tekrar eder; beyin bu ödülü ister.',
      'Zihin sigara içmen gerektiğini söylediğinde bu yalnızca öğrenilmiş bir döngüdür.',
      'Dumanless, hipnozla bu döngüyü kırmana yardım eder. Şimdi seni daha iyi tanıyalım.',
    ],
  },
  {
    id: 's6',
    type: 'question',
    kind: 'single',
    title:
      "Bir sağlık profesyoneli (örneğin bir doktor ya da danışman) sana Dumanless'i önerdi mi?",
    options: ['Evet, bir sağlık profesyoneli önerdi.', 'Hayır, başka bir yerden duydum.'],
  },
  {
    id: 's7',
    type: 'question',
    kind: 'single',
    title: 'Günde kaç sigara içiyorsun?',
    options: ['Bir iki tane', 'Yarım paket', 'Günde 1 paket', 'Günde 1 paketten fazla'],
  },
  {
    id: 's8',
    type: 'question',
    kind: 'single',
    title: 'Sigara içmeye neden başladın?',
    options: [
      'Ortama ayak uydurmak için',
      'Ailede sigara içildiği için',
      'Stresle başa çıkmak için',
      'Sadece denemek için',
      'Özgür hissetmek için',
      'Hatırlamıyorum',
    ],
  },
  {
    id: 's9',
    type: 'question',
    kind: 'multi',
    title: 'Sigara içmenin sana göre avantajı var mı?',
    note: '(Çoklu seçim yapabilirsin.)',
    options: [
      'Stresimi azalttığını düşünüyorum',
      'Gün içinde yapacak bir şey veriyor',
      'Kaçamak yapmamı sağlıyor',
      'Özgüven kattığını hissediyorum',
      'Sosyalleşmeme yardımcı oluyor',
      'Tadını ya da hissini seviyorum',
      'Bence avantajı yok',
    ],
  },
  {
    id: 's10',
    type: 'question',
    kind: 'single',
    title: "'Sigara benim rahatlama yöntemim' cümlesine ne kadar katılıyorsun?",
    options: ['Kesinlikle katılıyorum', 'Katılıyorum', 'Katılmıyorum', 'Emin değilim'],
  },
  {
    id: 's11',
    type: 'info',
    title: 'Eğitim',
    image: '/illustrations/alert.svg',
    body: [
      'Şehir efsanesi: Sigara içmek rahatlatıcıdır. YANLIŞ',
      'Sigaradaki nikotin aslında bir uyarıcıdır; rahatlatıcının tam zıttıdır.',
      'Rahatlama hissi, nikotinin oluşturduğu yoksunluk belirtilerinin geçici olarak hafiflemesidir.',
      'Alışkanlığı tamamen bırakmak, bir sigara sonrası gelen sahte rahatlamadan çok daha büyük bir özgürlük sağlar.',
    ],
  },
  {
    id: 's12',
    type: 'question',
    kind: 'multi',
    title: 'Hangi fiziksel belirtileri yaşıyorsun?',
    options: [
      'Nefes sorunları',
      'Cilt ya da sivilce problemleri',
      'Ağız kokusu',
      'Diş sararması',
      'Saç dökülmesi',
      'Sık hastalanma veya grip',
      'Göğüs ağrısı',
    ],
  },
  {
    id: 's13',
    type: 'question',
    kind: 'multi',
    title: 'Sigara sende hangi sorunlara yol açtı?',
    options: [
      'Özgüven kaybı',
      'Finansal yük (sigaraya giden para)',
      'Sağlık sorunları',
      'Sosyalleşme güçlüğü',
      'İlişki sorunları',
      'Diğer',
    ],
  },
  {
    id: 's14',
    type: 'question',
    kind: 'multi',
    title: 'Sigara içmen kimleri etkiliyor ya da kimler şikâyetçi?',
    options: ['Çocuklar', 'Partnerim / eşim', 'Ailem', 'Arkadaşlarım', 'Diğer', 'Hiç kimse'],
  },
  {
    id: 's15',
    type: 'question',
    kind: 'multi',
    title: 'Onlar bu durumdan nasıl etkileniyor?',
    options: [
      'Benim yüzümden onlar da başladı',
      'Sağlığım için endişeliler',
      'Sürekli stres yapıyorlar',
      'Kötü örnek olduğumu düşünüyorlar',
      'Diğer',
    ],
  },
  {
    id: 's16',
    type: 'question',
    kind: 'multi',
    title: 'Bırakamazsan kendini ileride nasıl görüyorsun?',
    options: [
      'Sağlık problemleri yaşayan biri olarak',
      'Finansal baskı yaşayan biri olarak',
      'Sevdiklerime karşı mahcup biri olarak',
      'Daha kaygılı ve stresli biri olarak',
      'Çocuklarıma bu davranışı aktaran biri olarak',
      'Diğer',
    ],
  },
  {
    id: 's17',
    type: 'question',
    kind: 'single',
    title: 'Daha iyi bir gelecek için sigarayı bırakmaya ne kadar hazırsın?',
    options: ['Çok hazırım', 'Biraz hazırım', 'Henüz hazır hissetmiyorum'],
  },
  {
    id: 's18',
    type: 'info',
    image: '/illustrations/spark.svg',
    body: [
      'Tamam. Başarının en önemli faktörü gerçekten değişmek istemen.',
      'Hipnoz, bu kararı destekleyen motivasyonu güçlendirir.',
    ],
  },
  {
    id: 's19',
    type: 'question',
    kind: 'multi',
    title: 'Sigarayı bıraktığını hayal et. Kendini nasıl hissedersin?',
    options: [
      'Hayatımın kontrolünü ele almış gibi',
      'Daha sağlıklı bir bedende',
      'Özgüvenli biri olarak',
      'Bırakmaktan korkmayan biri olarak',
      'Sakin ve huzurlu biri olarak',
      'Kendimle gurur duyan biri olarak',
      'Diğer',
    ],
  },
  {
    id: 's20',
    type: 'question',
    kind: 'multi',
    title: 'Sevdiklerin (partnerin/eşin, çocukların, ailen veya arkadaşların) nasıl hisseder?',
    options: ['Rahatlamış', 'Gururlu', 'Geleceğimiz için heyecanlı', 'Motive olmuş', 'Mutlu', 'Müteşekkir', 'Diğer'],
  },
  {
    id: 's21',
    type: 'question',
    kind: 'multi',
    title: 'Senin hayatın nasıl değişir?',
    options: [
      'Daha sağlıklı hissederim',
      'Daha fazla param olur',
      'İlişkilerim güçlenir',
      'Tat alma duyum geri döner',
      'Daha güzel kokarım',
      'Özgüvenim artar',
      'Diğer',
    ],
  },
  {
    id: 's22',
    type: 'question',
    kind: 'multi',
    title: '5 yıl sigara içmediğinde hayatın nasıl olur?',
    options: [
      'Sevdiklerimle daha fazla zaman',
      'Daha fazla seyahat',
      'Yeni hobiler',
      'Daha sosyal bir hayat',
      'Daha sağlıklı bir benlik',
      'Daha fazla birikim',
      'Diğer',
    ],
  },
  {
    id: 's23',
    type: 'question',
    kind: 'single',
    title:
      'Kalıcı olarak bırakmanın mümkün olduğuna inansan bugün bu yolculuğa başlar mısın?',
    options: ['Evet', 'Hayır'],
  },
  {
    id: 's24',
    type: 'info',
    title: 'Vücudun nasıl iyileşir?',
    image: '/illustrations/healing.svg',
    body: [
      'Birkaç saat içinde||Kan basıncın düşer, dolaşımın iyileşir ve kalp yükün hafifler.',
      '1 yıl sonra||Kalp hastalığı ve kalp krizi riskin neredeyse yarıya iner.',
      '5 yıl sonra||İnme riskin sigara içmeyen biriyle aynı seviyeye yaklaşır.',
    ],
  },
  {
    id: 's25',
    type: 'info',
    title: 'İyileşme yolculuğu',
    image: '/illustrations/healing.svg',
    body: [
      'İlk 72 saat||Nikotin tamamen atılır; tat ve koku duyuların canlanır.',
      '1 ay sonra||Akciğer kapasiten artar, nefes darlığı azalır.',
      '3 ay sonra||Bağışıklık sistemin güçlenir, günlük enerjin yükselir.',
    ],
  },
  {
    id: 's26',
    type: 'question',
    kind: 'single',
    title: 'Daha önce sigarayı bırakmayı kaç kez denedin?',
    options: ['1-5 kez', '10-20 kez', '20-30 kez', "30'dan fazla", 'Hiç denemedim'],
  },
  {
    id: 's27',
    type: 'question',
    kind: 'single',
    title: 'Sigarayı bırakma konusunda kendine ne kadar güveniyorsun?',
    options: ['Çok güveniyorum', 'Kararsızım', 'Bırakabileceğimi sanmıyorum'],
  },
  {
    id: 's28',
    type: 'info',
    title: 'Gerçekçi beklentiler',
    image: '/illustrations/support.svg',
    body: [
      "Araştırmalar, destek almadan uzun vadeli başarı için ortalama 30'dan fazla deneme gerektiğini söylüyor.",
      'Hipnoterapi ile yapılandırılmış destek aldığında başarılı olma ihtimalin 10 kat artabilir.',
    ],
  },
  {
    id: 's29',
    type: 'question',
    kind: 'single',
    title: 'Doğru desteği alırsan sigarayı bırakabileceğine inanıyor musun?',
    options: ['Evet, inanıyorum', 'Kararsızım', 'Hayır'],
  },
  {
    id: 's30',
    type: 'info',
    title: 'Dumanless nasıl çalışır?',
    image: '/illustrations/trust.svg',
    body: [
      'Beyin yapını yeniden eğitirken sigara sayısını kademeli olarak azaltırsın.',
      'Her gün kısa hipnoterapi seansları ve mikro görevlerle özgüven kazanırsın.',
      'Program boyunca seni takip eden bir ekip, ilerlemeni değerlendirir.',
    ],
  },
  {
    id: 's31',
    type: 'question',
    kind: 'single',
    title: 'Sigarayı bırakmak için günde ne kadar zaman ayırabilirsin?',
    options: ['15 dakika', '15-30 dakika', '30-60 dakika', '1 saatten fazla'],
  },
  {
    id: 's32',
    type: 'info',
    title: '7 günlük deneme',
    image: '/illustrations/routine.svg',
    body: [
      "Dumanless'in ilk haftasında daha az sigara içmeye ve hazır olmaya odaklanırsın.",
      'Bu yüzden sana nelerin mümkün olduğunu göstermek için 7 günlük bir deneme sunuyoruz.',
    ],
  },
  {
    id: 's33',
    type: 'info',
    title: 'Tetikleyicilerini tanı',
    image: '/illustrations/trigger.svg',
    body: [
      'Yemek sonrası, araç kullanmak, arkadaş grubunun içmesi veya duygusal dalgalanmalar gibi tetikleyiciler olabilir.',
      'Hipnoterapi, eğitici okumalar ve günlük görevlerle bu tetikleyicileri yönetmeyi öğrenirsin.',
    ],
  },
  {
    id: 's34',
    type: 'info',
    title: 'Neden işe yarıyor?',
    image: '/illustrations/benefits.svg',
    body: [
      'Dumanless, klinik psikologlar ve hipnoterapistler tarafından hazırlanmış içerikler sunar.',
      'Program süresince topluluk desteği ve kişiselleştirilmiş takip alırsın.',
    ],
  },
  {
    id: 's35',
    type: 'info',
    title: 'Programda neler var?',
    image: '/illustrations/package.svg',
    body: [
      'Günlük hipnoz kayıtları, tetikleyici haritalama, nefes egzersizleri ve davranış görevleri.',
      'Kendini değerlendirme quizleri ve ilerleme raporlarıyla motivasyonunu korursun.',
    ],
  },
  {
    id: 's36',
    type: 'info',
    title: 'Destek araçları',
    image: '/illustrations/screen.svg',
    body: [
      'Uygulama içi hatırlatmalar, sesli rehberlik ve yeni içerik güncellemeleri sürecini destekler.',
    ],
  },
  {
    id: 's37',
    type: 'info',
    title: 'İlk 7 gün planı',
    image: '/illustrations/calendar.svg',
    body: [
      '1–2. Gün: Günlük hipnozla zihnini hazırlarsın ve sigara sayılarını kaydedersin.',
      '3–4. Gün: Tetikleyicilerini işaretler, yerine koyabileceğin mikro alışkanlıklar seçersin.',
      '5–7. Gün: Sigara sayını azaltır, eğitim içeriklerini tamamlarsın ve sorularını koça iletirsin.',
    ],
  },
  {
    id: 's38',
    type: 'info',
    title: 'Program görseli',
    image: '/illustrations/screen.svg',
    body: ['Program içinden birkaç ekran görüntüsü'],
  },
  {
    id: 's39',
    type: 'question',
    kind: 'single',
    title:
      'Denemenin bir parçası olarak ilk hafta içeriklerine erişeceksin. Bu hafta 5 seansı dinlemeye kararlı mısın?',
    options: ['Evet', 'Emin değilim'],
  },
  {
    id: 's40',
    type: 'info',
    title: 'Analiz',
    body: [
      'Yanıtların analiz ediliyor...',
      'Sana özel sigarayı bırakma planı hazırlanıyor...',
      'Özgür bir hayat planın bitmek üzere...',
    ],
  },
];

export const STEPS: QuizStep[] = RAW_STEPS.map((step) => {
  if (step.type === 'question') {
    return {
      id: step.id,
      type: 'question',
      kind: step.kind,
      title: step.title,
      helper: step.note,
      options: step.options.map((label, index) => ({
        id: `o${index + 1}`,
        label,
      })),
    };
  }

  return {
    id: step.id,
    type: 'info',
    title: step.title,
    body: step.body ?? [],
    image: step.image,
  };
});

export const QUESTION_STEPS = STEPS.filter(
  (step): step is QuizQuestionStep => step.type === 'question'
);
