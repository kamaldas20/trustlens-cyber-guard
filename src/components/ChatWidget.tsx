import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Globe } from 'lucide-react';
import { useLanguage, Lang } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const botResponses: Record<Lang, Record<string, string>> = {
  en: {
    greeting: "Hello! I'm your AI Safety Assistant. Ask me about cyber safety, scam detection, or AI awareness.",
    phishing: "Phishing attacks trick you into sharing personal information. Always verify the sender's email, look for spelling errors, and never click suspicious links. When in doubt, go directly to the website instead of clicking email links.",
    password: "Use strong passwords: 12+ characters, mix of uppercase, lowercase, numbers, and symbols. Never reuse passwords across sites. Consider using a password manager.",
    deepfake: "Deepfakes use AI to create fake videos or audio. Look for unnatural facial movements, inconsistent lighting, and audio-visual mismatches. Use our detection tools to verify suspicious content.",
    scam: "Common scams include lottery/prize notifications, tech support calls, and romance scams. Never send money to strangers, and verify identities through official channels.",
    default: "That's a great question about cyber safety! I recommend: 1) Keep your software updated, 2) Use two-factor authentication, 3) Be cautious with unknown links and attachments. For specific threats, use our analysis tools in the dashboard.",
  },
  hi: {
    greeting: "नमस्ते! मैं आपका AI सुरक्षा सहायक हूँ। साइबर सुरक्षा, स्कैम डिटेक्शन या AI जागरूकता के बारे में पूछें।",
    phishing: "फ़िशिंग हमले आपकी व्यक्तिगत जानकारी चुराने की कोशिश करते हैं। हमेशा भेजने वाले की जांच करें, स्पेलिंग गलतियों पर ध्यान दें, और संदिग्ध लिंक पर कभी क्लिक न करें।",
    password: "मजबूत पासवर्ड का उपयोग करें: 12+ अक्षर, बड़े-छोटे अक्षर, नंबर और प्रतीकों का मिश्रण। कभी भी एक ही पासवर्ड दोबारा उपयोग न करें।",
    deepfake: "डीपफेक AI का उपयोग करके नकली वीडियो या ऑडियो बनाता है। अप्राकृतिक चेहरे की गतिविधियों और ऑडियो-विजुअल बेमेल पर ध्यान दें।",
    scam: "सामान्य स्कैम में लॉटरी सूचनाएं, टेक सपोर्ट कॉल और रोमांस स्कैम शामिल हैं। अजनबियों को कभी पैसे न भेजें।",
    default: "साइबर सुरक्षा के बारे में अच्छा सवाल! सुझाव: 1) सॉफ़्टवेयर अपडेट रखें, 2) दो-कारक प्रमाणीकरण उपयोग करें, 3) अज्ञात लिंक से सावधान रहें।",
  },
  od: {
    greeting: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ AI ସୁରକ୍ଷା ସହାୟକ। ସାଇବର ସୁରକ୍ଷା, ସ୍କାମ ଚିହ୍ନଟ ବା AI ସଚେତନତା ବିଷୟରେ ପଚାରନ୍ତୁ।",
    phishing: "ଫିସିଂ ଆକ୍ରମଣ ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ତଥ୍ୟ ଚୋରି କରିବାକୁ ଚେଷ୍ଟା କରେ। ପ୍ରେରକଙ୍କୁ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ସନ୍ଦେହଜନକ ଲିଙ୍କରେ କ୍ଲିକ କରନ୍ତୁ ନାହିଁ।",
    password: "ଶକ୍ତିଶାଳୀ ପାସୱାର୍ଡ ବ୍ୟବହାର କରନ୍ତୁ: 12+ ଅକ୍ଷର, ବଡ଼-ଛୋଟ ଅକ୍ଷର, ସଂଖ୍ୟା ଏବଂ ପ୍ରତୀକର ମିଶ୍ରଣ।",
    deepfake: "ଡିପଫେକ AI ବ୍ୟବହାର କରି ନକଲି ଭିଡିଓ ବା ଅଡିଓ ତିଆରି କରେ। ଅପ୍ରାକୃତିକ ମୁଖ ଗତିବିଧି ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ।",
    scam: "ସାଧାରଣ ସ୍କାମରେ ଲଟେରୀ ସୂଚନା, ଟେକ ସପୋର୍ଟ କଲ ଏବଂ ରୋମାନ୍ସ ସ୍କାମ ଅନ୍ତର୍ଭୁକ୍ତ। ଅଜଣା ଲୋକଙ୍କୁ ପଇସା ପଠାନ୍ତୁ ନାହିଁ।",
    default: "ସାଇବର ସୁରକ୍ଷା ବିଷୟରେ ଭଲ ପ୍ରଶ୍ନ! ସୁଝାବ: 1) ସଫ୍ଟୱେୟାର ଅପଡେଟ ରଖନ୍ତୁ, 2) ଦୁଇ-ଫ୍ୟାକ୍ଟର ପ୍ରମାଣୀକରଣ ବ୍ୟବହାର କରନ୍ତୁ, 3) ଅଜଣା ଲିଙ୍କରୁ ସାବଧାନ ରୁହନ୍ତୁ।",
  },
};

function getBotReply(input: string, lang: Lang): string {
  const lower = input.toLowerCase();
  const responses = botResponses[lang];
  if (lower.includes('phish') || lower.includes('फ़िशिंग') || lower.includes('ফিసিং') || lower.includes('link')) return responses.phishing;
  if (lower.includes('password') || lower.includes('पासवर्ड') || lower.includes('ପାସୱାର୍ଡ')) return responses.password;
  if (lower.includes('deepfake') || lower.includes('डीपफेक') || lower.includes('ଡିପଫେକ') || lower.includes('fake')) return responses.deepfake;
  if (lower.includes('scam') || lower.includes('स्कैम') || lower.includes('ସ୍କାମ') || lower.includes('fraud')) return responses.scam;
  return responses.default;
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: botResponses[lang].greeting, isBot: true },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{ id: 0, text: botResponses[lang].greeting, isBot: true }]);
  }, [lang]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: idRef.current++, text: input, isBot: false };
    const botMsg: Message = { id: idRef.current++, text: getBotReply(input, lang), isBot: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 600);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg neon-glow-blue transition-transform hover:scale-110"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[28rem] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm font-semibold">{t('chatTitle')}</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      msg.isBot
                        ? 'bg-muted/50 text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={t('chatPlaceholder')}
                  className="flex-1 bg-muted/30 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  onClick={send}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
