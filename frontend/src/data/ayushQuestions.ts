/**
 * @file ayushQuestions.ts
 * @description Dashavidha & Trividha Pariksha questions for AYUSH clinical intake.
 */

export interface AyushQuestion {
  key: 'prakriti' | 'agni' | 'koshtha';
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  options: Array<{
    value: string;
    labelEn: string;
    labelHi: string;
    descEn: string;
    descHi: string;
    dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Mixed';
  }>;
}

export const AYUSH_QUESTIONS: AyushQuestion[] = [
  {
    key: 'prakriti',
    titleEn: 'Prakriti Assessment (Body Constitution / शारीरिक प्रकृति)',
    titleHi: 'प्रकृति मूल्यांकन (शारीरिक एवं मानसिक स्वभाव)',
    descEn: 'Identify your dominant dosha based on physical and thermal tendency',
    descHi: 'अपने शारीरिक गठन और मौसम के प्रति संवेदनशीलता के आधार पर चयन करें',
    options: [
      {
        value: 'Vata Pradhana (वात प्रधान)',
        labelEn: 'Vata Predominant (वात प्रधान)',
        labelHi: 'वात प्रधान (सूखापन, ठंड लगना, चंचल स्वभाव)',
        descEn: 'Lean body frame, dry skin, sensitive to cold breezes, irregular appetite',
        descHi: 'दुबला शरीर, सूखी त्वचा, ठंड बर्दाश्त न होना, अनियमित भूख',
        dosha: 'Vata',
      },
      {
        value: 'Pitta Pradhana (पित्त प्रधान)',
        labelEn: 'Pitta Predominant (पित्त प्रधान)',
        labelHi: 'पित्त प्रधान (जलन, गर्मी लगना, तीव्र भूख)',
        descEn: 'Moderate build, warm body, intolerant to heat/sun, strong digestion, prone to acidity',
        descHi: 'मध्यम गठन, गर्मी ज्यादा लगना, तेज भूख, खट्टी डकार या पित्त की प्रवृत्ति',
        dosha: 'Pitta',
      },
      {
        value: 'Kapha Pradhana (कफ प्रधान)',
        labelEn: 'Kapha Predominant (कफ प्रधान)',
        labelHi: 'कफ प्रधान (भारी शरीर, सुस्ती, स्थिर स्वभाव)',
        descEn: 'Solid heavy build, oily smooth skin, slow metabolism, calm and steady temperament',
        descHi: 'मजबूत/भारी शरीर, तैलीय त्वचा, धीमी पाचन शक्ति, शांत स्वभाव',
        dosha: 'Kapha',
      },
      {
        value: 'Vata-Kapha Pradhana (वात-कफ प्रधान)',
        labelEn: 'Vata-Kapha Mixed (वात-कफ द्विदोषज)',
        labelHi: 'वात-कफ मिश्रित (जोड़ों में दर्द व जकड़न)',
        descEn: 'Combination of joint crepitus, stiffness in cold weather, and irregular digestion',
        descHi: 'ठंड में जोड़ों में जकड़न, शरीर में दर्द और भारीपन',
        dosha: 'Mixed',
      }
    ]
  },
  {
    key: 'agni',
    titleEn: 'Agni Pariksha (Digestive Fire / पाचन अग्नि)',
    titleHi: 'अग्नि परीक्षा (पाचन शक्ति का स्वभाव)',
    descEn: 'How does your stomach handle food digestion and appetite?',
    descHi: 'आपकी भूख और भोजन पचने की क्षमता कैसी है?',
    options: [
      {
        value: 'Samagni (Balanced Digestion / समाग्नि)',
        labelEn: 'Samagni — Balanced & Healthy Digestion',
        labelHi: 'समाग्नि — समय पर सामान्य भूख और स्वस्थ पाचन',
        descEn: 'Digests normal meals on time without bloating, gas, or acidity',
        descHi: 'समय पर उचित भूख लगना और बिना किसी परेशानी के भोजन पचना',
        dosha: 'Mixed',
      },
      {
        value: 'Vishama Agni (Irregular / विषमाग्नि - Vata)',
        labelEn: 'Vishama Agni — Irregular Digestion (Vata)',
        labelHi: 'विषमाग्नि — कभी बहुत तेज भूख, कभी बिल्कुल भूख नहीं (वात)',
        descEn: 'Fluctuating appetite, frequent bloating, gas formation, and constipation',
        descHi: 'अनियमित भूख, पेट फूलना, गैस और कब्ज की समस्या',
        dosha: 'Vata',
      },
      {
        value: 'Tikshnagni (Hyperactive / तीक्ष्णाग्नि - Pitta)',
        labelEn: 'Tikshnagni — Intense & Rapid Digestion (Pitta)',
        labelHi: 'तीक्ष्णाग्नि — अत्यधिक तेज भूख, जलन व एसिडिटी (पित्त)',
        descEn: 'Intense hunger, burning sensation in epigastrium if meals are delayed',
        descHi: 'खाना देरी से खाने पर सीने या पेट में जलन होना',
        dosha: 'Pitta',
      },
      {
        value: 'Mandagni (Sluggish / मन्दाग्नि - Kapha)',
        labelEn: 'Mandagni — Slow & Sluggish Digestion (Kapha)',
        labelHi: 'मन्दाग्नि — धीमी पाचन शक्ति और भोजन के बाद भारीपन (कफ)',
        descEn: 'Poor appetite, heavy sensation in stomach for hours after light food',
        descHi: 'कम भूख लगना और हल्का खाना खाने के बाद भी भारीपन रहना',
        dosha: 'Kapha',
      }
    ]
  },
  {
    key: 'koshtha',
    titleEn: 'Koshtha Pariksha (Bowel Motility / कोष्ठ परीक्षा)',
    titleHi: 'कोष्ठ परीक्षा (मल त्याग की प्रवृत्ति)',
    descEn: 'Assessment of bowel regularity and evacuation tendency',
    descHi: 'शौच क्रिया और पेट साफ होने की प्रवृत्ति',
    options: [
      {
        value: 'Madhyama Koshtha (Regular Bowel / मध्यम कोष्ठ)',
        labelEn: 'Madhyama Koshtha — Regular & Effortless',
        labelHi: 'मध्यम कोष्ठ — बिना कष्ट के नियमित पेट साफ होना',
        descEn: 'Natural daily bowel movement without hard straining or loose stools',
        descHi: 'प्रतिदिन सुबह आसानी से पेट साफ होना',
        dosha: 'Mixed',
      },
      {
        value: 'Krura Koshtha (Hard / Constipated / क्रूर कोष्ठ - Vata)',
        labelEn: 'Krura Koshtha — Hard & Constipated (Vata)',
        labelHi: 'क्रूर कोष्ठ — कठोर मल, कब्ज व देर से पेट साफ होना (वात)',
        descEn: 'Requires laxatives or warm liquids; hard dry stools, irregular frequency',
        descHi: 'कड़ा मल, अक्सर कब्ज रहना, गर्म पानी या चूर्ण की आवश्यकता',
        dosha: 'Vata',
      },
      {
        value: 'Mridu Koshtha (Soft / Loose Motility / मृदु कोष्ठ - Pitta)',
        labelEn: 'Mridu Koshtha — Soft & Sensitive (Pitta)',
        labelHi: 'मृदु कोष्ठ — दूध या हल्का फल खाने से भी दस्त लग जाना (पित्त)',
        descEn: 'Very quick evacuation; even warm milk or grapes induce bowel movements',
        descHi: 'पाचन तंत्र अत्यधिक संवेदनशील, जल्दी-जल्दी शौच जाना',
        dosha: 'Pitta',
      }
    ]
  }
];
