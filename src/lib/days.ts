export type DayTask = {
  title: string;
  description: string;
};

export type DayContent = {
  day: number;
  title: string;
  opening: string;
  content: string;
  task: DayTask;
};

const baseDays: DayContent[] = [
  {
    day: 1,
    title: 'Gün 1 – Sigara Alışkanlığının Döngüsü',
    opening: 'Hoş geldin! Bugün sigara alışkanlığının nasıl bir döngü olduğuna bakacağız. Seni zorlayan bu döngüyü anlaman önemli.',
    content:
      'Sigara alışkanlığı tetikleyici, rutin ve ödülden oluşur. Tetikleyici (kahve, stres), rutin (sigara içmek) ve ödül (dopamin salınımı) bir kısır döngü yaratır. Bu döngüyü fark etmek, onun gücünü azaltır.',
    task: {
      title: 'Bir tetikleyiciyi not et',
      description: 'Bugün sigara isteğini tetikleyen bir anı telefonuna not et. Ekrana yaz ve kaydet.',
    },
  },
  {
    day: 2,
    title: 'Gün 2 – Dopamin ve Beyin',
    opening: 'Bugün dopaminin nasıl çalıştığını öğreneceğiz.',
    content:
      'Sigara içmek, beyinde yüksek miktarda dopamin salınımına yol açar. Zamanla beyin bu seviyeye alışır ve daha fazlasını ister. Bu yüzden bırakma sürecinde iniş çıkışlar yaşarsın.',
    task: {
      title: 'Dopamin Nefesi',
      description: '60 saniye boyunca derin nefes al; her nefeste 4 saniye al, 4 saniye tut, 4 saniye ver.',
    },
  },
  {
    day: 3,
    title: 'Gün 3 – Tetikleyicilerini Tanı',
    opening: 'Seni sigara içmeye iten tetikleyiciler neler?',
    content:
      'Kahve molası, arkadaş ortamı, stresli bir toplantı… Herkesin tetikleyicisi farklı. Bu farkındalık, onları yeniden yapılandırmana yardımcı olur.',
    task: {
      title: 'Tetikleyici Haritası',
      description: 'Gün içinde en az iki tetikleyici durumunu uygulamadaki form ile kaydet.',
    },
  },
  {
    day: 4,
    title: 'Gün 4 – İlk Krizler ve Sabır',
    opening: 'Bugün zorlanabilirsin ve bu çok normal.',
    content:
      'Bırakmanın ilk günlerinde vücut nikotinsiz kalır. Baş ağrısı, gerginlik ve iştah artışı yaşayabilirsin. Bu semptomlar geçicidir.',
    task: {
      title: 'Kriz Günlüğü',
      description: 'Bir isteğin geldiğinde süresini ölç ve ne kadar sürdüğünü not al. Genellikle 5–7 dakika içinde geçer.',
    },
  },
  {
    day: 5,
    title: 'Gün 5 – Nefes ve Meditasyon',
    opening: 'Bugün nefes egzersizlerinin gücünü kullanacağız.',
    content:
      'Bilinçli nefes alma, sinir sistemini sakinleştirir ve dopamin seviyesini dengeler. Her istek geldiğinde 4–7–8 nefes tekniğini dene.',
    task: {
      title: 'Nefes Bileziği',
      description: 'Telefonun ekranında beliren daireyi takip ederek 1 dakika boyunca 4–7–8 nefes tekniğini uygula.',
    },
  },
  {
    day: 6,
    title: 'Gün 6 – Ödülünü Yeniden Tanımla',
    opening: 'Sigara içmediğinde ne kazanıyorsun?',
    content:
      'Para, zaman, taze nefes, daha iyi koku alma… Bunlar senin yeni ödüllerin. Bugün bu kazanımları listele.',
    task: {
      title: 'Kazanç Listesi',
      description: 'Uygulamadaki kartlara bugünden itibaren kazandığın üç şeyi yaz.',
    },
  },
  {
    day: 7,
    title: 'Gün 7 – İlk Haftayı Kutla',
    opening: 'Bir haftayı geride bıraktın, bravo!',
    content:
      'İlk yedi günü tamamlamak en büyük eşiklerden biridir. Kısa vadeli hedefler koymak motivasyonunu artırır. Bugün kendini ödüllendir.',
    task: {
      title: 'Küçük ödül',
      description: 'Sevdiğin sağlıklı bir atıştırmalık veya aktiviteyi planla ve kendini ödüllendir.',
    },
  },
];

const placeholderDays: DayContent[] = Array.from({ length: 53 }, (_, i) => {
  const day = i + 8;
  return {
    day,
    title: `Gün ${day} – Yeni adım`,
    opening: 'Bugün ana fikrin kısa ve net: bu isteğin geçici, odaklan ve geçmesine izin ver.',
    content: 'Bu güne ait detaylı içerik yakında burada olacak. Şimdilik kısa bir not bırak: su iç, nefes al ve bir süre ertele.',
    task: {
      title: 'Mini görev',
      description: 'Bugün sadece bir dakika ayır ve nasıl hissettiğini not düş. Kısa ve dürüst olsun.',
    },
  };
});

const days: DayContent[] = [...baseDays, ...placeholderDays];

export default days;
