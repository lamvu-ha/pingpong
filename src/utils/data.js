export const GRAMMAR_QUESTIONS = {

  // LEVEL 1 — Basic
  'Present Simple': {
    level: 1,
    structure: 'S + V(s/es) / S + do/does + not + V',
    questions: [
      { wrong: 'He don\'t like coffee.', correct: 'He doesn\'t like coffee.', explanation: 'With he/she/it, use "doesn\'t" (does not) for negatives. The main verb stays in base form.' },
      { wrong: 'She go to school every day.', correct: 'She goes to school every day.', explanation: 'With he/she/it in present simple affirmative, add -s or -es to the verb. "go" → "goes".' },
      { wrong: 'They eats breakfast together.', correct: 'They eat breakfast together.', explanation: 'With plural subjects (they/we/you), the verb has NO -s ending.' },
      { wrong: 'He have two cats.', correct: 'He has two cats.', explanation: '"Have" becomes "has" when the subject is he/she/it.' },
      { wrong: 'Do she works here?', correct: 'Does she work here?', explanation: 'Use "does" (not "do") with he/she/it. The main verb stays in base form.' },
      { wrong: 'She don\'t speak English well.', correct: 'She doesn\'t speak English well.', explanation: 'Negative with he/she/it requires "doesn\'t", not "don\'t".' },
      { wrong: 'My brother play football on weekends.', correct: 'My brother plays football on weekends.', explanation: '"My brother" = he → add -s to the verb: "plays".' },
      { wrong: 'Water not boil at 50°C.', correct: 'Water does not boil at 50°C.', explanation: 'To make a negative in present simple, use "does not" + base verb.' },
    ]
  },

  'Articles': {
    level: 1,
    structure: 'a + consonant sound / an + vowel sound / the + specific',
    questions: [
      { wrong: 'She is a honest person.', correct: 'She is an honest person.', explanation: '"Honest" starts with a vowel sound /ɒ/, so use "an", not "a".' },
      { wrong: 'I saw an university nearby.', correct: 'I saw a university nearby.', explanation: '"University" starts with a /j/ consonant sound, so use "a", not "an".' },
      { wrong: 'Can you pass the a salt?', correct: 'Can you pass the salt?', explanation: 'Don\'t use both "the" and "a" together. Use "the" for specific/known items.' },
      { wrong: 'He is best student in class.', correct: 'He is the best student in class.', explanation: 'Use "the" with superlatives (best, tallest, etc.).' },
      { wrong: 'I need advices from you.', correct: 'I need advice from you.', explanation: '"Advice" is uncountable — it has no plural form. Don\'t add -s.' },
    ]
  },

  'Plurals': {
    level: 1,
    structure: 'Regular: +s / +es | Irregular: mouse→mice, child→children',
    questions: [
      { wrong: 'There are three childs in the room.', correct: 'There are three children in the room.', explanation: '"Child" has an irregular plural: children (not childs).' },
      { wrong: 'She has two tooths missing.', correct: 'She has two teeth missing.', explanation: '"Tooth" → "teeth" is an irregular plural form.' },
      { wrong: 'We saw many sheeps on the farm.', correct: 'We saw many sheep on the farm.', explanation: '"Sheep" is the same in singular and plural — no -s added.' },
      { wrong: 'The informations are useful.', correct: 'The information is useful.', explanation: '"Information" is uncountable — always singular, never "informations".' },
    ]
  },

  'Be Verb': {
    level: 1,
    structure: 'I am / You are / He-She-It is / We-They are',
    questions: [
      { wrong: 'She are a teacher.', correct: 'She is a teacher.', explanation: '"She" takes "is", not "are". Remember: I am / He-She-It is / We-You-They are.' },
      { wrong: 'They is very happy.', correct: 'They are very happy.', explanation: '"They" takes "are", not "is".' },
      { wrong: 'I is from Vietnam.', correct: 'I am from Vietnam.', explanation: '"I" always takes "am".' },
      { wrong: 'We was at home yesterday.', correct: 'We were at home yesterday.', explanation: 'Past tense of "be" with we/you/they is "were", not "was".' },
    ]
  },

  // LEVEL 2 — Intermediate
  'Present Continuous': {
    level: 2,
    structure: 'S + am/is/are + V-ing',
    questions: [
      { wrong: 'She is study right now.', correct: 'She is studying right now.', explanation: 'Present Continuous = am/is/are + V-ing. "study" → "studying".' },
      { wrong: 'They are run in the park.', correct: 'They are running in the park.', explanation: '"run" → double the final consonant → "running" in present continuous.' },
      { wrong: 'He is makeing a cake.', correct: 'He is making a cake.', explanation: 'Drop the final -e before adding -ing: "make" → "making".' },
      { wrong: 'I am not understanding this.', correct: 'I do not understand this.', explanation: '"Understand" is a stative verb — it cannot be used in continuous tenses.' },
      { wrong: 'Are you wanting some coffee?', correct: 'Do you want some coffee?', explanation: '"Want" is a stative verb and doesn\'t take the -ing form in questions.' },
    ]
  },

  'Past Simple': {
    level: 2,
    structure: 'S + V2 / S + did not + V1 / Did + S + V1?',
    questions: [
      { wrong: 'She goed to the market yesterday.', correct: 'She went to the market yesterday.', explanation: '"Go" is an irregular verb. Past simple of "go" = "went".' },
      { wrong: 'He didn\'t went to school.', correct: 'He didn\'t go to school.', explanation: 'After "didn\'t", always use the base form of the verb (V1), not past form.' },
      { wrong: 'Did she ate the cake?', correct: 'Did she eat the cake?', explanation: 'After "did", always use the base form (V1). "ate" should be "eat".' },
      { wrong: 'I buyed a new phone last week.', correct: 'I bought a new phone last week.', explanation: '"Buy" is irregular: buy → bought (not "buyed").' },
      { wrong: 'We seen a great movie last night.', correct: 'We saw a great movie last night.', explanation: '"See" is irregular: see → saw → seen. Simple past = "saw".' },
    ]
  },

  'Comparatives': {
    level: 2,
    structure: 'adj+er + than / more + adj + than',
    questions: [
      { wrong: 'She is more taller than her sister.', correct: 'She is taller than her sister.', explanation: 'Don\'t use "more" with short adjectives. "tall" → "taller" (not "more taller").' },
      { wrong: 'This book is more interesting than that.', correct: 'This book is more interesting than that.', explanation: 'Actually this IS correct! For long adjectives (3+ syllables), use "more + adj".' },
      { wrong: 'He runs more faster than me.', correct: 'He runs faster than me.', explanation: '"Fast" is a short adjective/adverb — use "faster", not "more faster".' },
      { wrong: 'My bag is gooder than yours.', correct: 'My bag is better than yours.', explanation: '"Good" has an irregular comparative: good → better (not "gooder").' },
    ]
  },

  'Prepositions': {
    level: 2,
    structure: 'at (point) / in (area) / on (surface/day)',
    questions: [
      { wrong: 'I will meet you in Monday.', correct: 'I will meet you on Monday.', explanation: 'Use "on" with days of the week (on Monday, on Friday, etc.).' },
      { wrong: 'She was born on 1998.', correct: 'She was born in 1998.', explanation: 'Use "in" with years (in 1998, in 2023).' },
      { wrong: 'He arrives at the morning.', correct: 'He arrives in the morning.', explanation: 'Use "in" with parts of the day: in the morning, in the afternoon, in the evening.' },
      { wrong: 'The meeting is in 3 PM.', correct: 'The meeting is at 3 PM.', explanation: 'Use "at" with specific times (at 3 PM, at noon, at midnight).' },
    ]
  },

  // LEVEL 3 — Advanced
  'Present Perfect': {
    level: 3,
    structure: 'S + have/has + V3 (past participle)',
    questions: [
      { wrong: 'I have went to Paris twice.', correct: 'I have been to Paris twice.', explanation: '"Go" in present perfect: "have gone" means left and not back. "Have been" = visited and returned.' },
      { wrong: 'She has live here for 5 years.', correct: 'She has lived here for 5 years.', explanation: 'Present Perfect = have/has + past participle. "live" → "lived".' },
      { wrong: 'Have you ever ate sushi?', correct: 'Have you ever eaten sushi?', explanation: '"Eat" is irregular: eat → ate → eaten. Use the past participle "eaten".' },
      { wrong: 'He has already finish his work.', correct: 'He has already finished his work.', explanation: 'After "has/have", use the past participle: "finish" → "finished".' },
      { wrong: 'I know him since 2015.', correct: 'I have known him since 2015.', explanation: 'Use Present Perfect (not Simple Present) with "since" to describe ongoing situations.' },
    ]
  },

  'Passive Voice': {
    level: 3,
    structure: 'S + be + V3 (past participle)',
    questions: [
      { wrong: 'The book write by Shakespeare.', correct: 'The book was written by Shakespeare.', explanation: 'Passive Voice = be + past participle. "write" → "written". Use "was" for past.' },
      { wrong: 'English is spoke worldwide.', correct: 'English is spoken worldwide.', explanation: '"Speak" is irregular: speak → spoke → spoken. Use the past participle in passive.' },
      { wrong: 'The cake was eaten by them.', correct: 'The cake was eaten by them.', explanation: 'This IS correct! Passive: subject + was/were + past participle + by + agent.' },
      { wrong: 'The report will wrote tomorrow.', correct: 'The report will be written tomorrow.', explanation: 'Future passive = will be + past participle: "will be written".' },
      { wrong: 'He was arrested by police yesterday.', correct: 'He was arrested by the police yesterday.', explanation: 'Use "the police" (specific institution) with the definite article "the".' },
    ]
  },

  'Relative Clauses': {
    level: 3,
    structure: 'who (person) / which (thing) / that (both) / whose (possession)',
    questions: [
      { wrong: 'The man which lives next door is kind.', correct: 'The man who lives next door is kind.', explanation: 'Use "who" for people, "which" for things. "The man" is a person → "who".' },
      { wrong: 'The book who I read was amazing.', correct: 'The book which I read was amazing.', explanation: 'Use "which" (or "that") for things, not "who".' },
      { wrong: 'That\'s the girl whose bag was stolen.', correct: 'That\'s the girl whose bag was stolen.', explanation: 'This IS correct! "Whose" shows possession — "her bag was stolen".' },
      { wrong: 'The city that I was born is beautiful.', correct: 'The city where I was born is beautiful.', explanation: 'Use "where" for places when referring to a location.' },
    ]
  },

  'Conditionals': {
    level: 3,
    structure: 'Type 1: if+present, will+V | Type 2: if+past, would+V',
    questions: [
      { wrong: 'If I will see him, I will tell you.', correct: 'If I see him, I will tell you.', explanation: 'Type 1 Conditional: The "if" clause uses present simple (NOT will). "If I see..."' },
      { wrong: 'If she would study, she would pass.', correct: 'If she studied, she would pass.', explanation: 'Type 2 Conditional: "if" clause uses past simple (not would). "If she studied..."' },
      { wrong: 'If I had a million dollars, I will travel.', correct: 'If I had a million dollars, I would travel.', explanation: 'Type 2 Conditional: the main clause uses "would" + base verb, not "will".' },
      { wrong: 'If he had studied, he would passed.', correct: 'If he had studied, he would have passed.', explanation: 'Type 3 Conditional: main clause = would have + past participle.' },
    ]
  },

  // LEVEL 4 — Expert
  'Gerund vs Infinitive': {
    level: 4,
    structure: 'Gerund: V-ing | Infinitive: to + V',
    questions: [
      { wrong: 'I enjoy to read books.', correct: 'I enjoy reading books.', explanation: '"Enjoy" must be followed by a gerund (V-ing), not an infinitive. I enjoy reading.' },
      { wrong: 'She decided going to London.', correct: 'She decided to go to London.', explanation: '"Decide" is followed by infinitive (to + V), not a gerund.' },
      { wrong: 'He stopped to smoke last year.', correct: 'He stopped smoking last year.', explanation: '"Stop smoking" = gave up the habit. "Stop to smoke" = stopped in order to smoke (different meaning!).' },
      { wrong: 'They avoided to make noise.', correct: 'They avoided making noise.', explanation: '"Avoid" requires a gerund (V-ing): "avoided making".' },
      { wrong: 'I want going home now.', correct: 'I want to go home now.', explanation: '"Want" is always followed by infinitive (to + V): "want to go".' },
    ]
  },

  'Inversion': {
    level: 4,
    structure: 'Never/Rarely/Seldom + Aux + S + V',
    questions: [
      { wrong: 'Never I have seen such beauty.', correct: 'Never have I seen such beauty.', explanation: 'Negative adverbs (Never, Rarely, Seldom) at the front cause subject-auxiliary inversion.' },
      { wrong: 'Rarely she speaks in public.', correct: 'Rarely does she speak in public.', explanation: '"Rarely" triggers inversion: Rarely + does/did + subject + base verb.' },
      { wrong: 'Not only he speaks French but also Italian.', correct: 'Not only does he speak French but he also speaks Italian.', explanation: '"Not only" at the start triggers inversion in the first clause.' },
    ]
  },

  'Subjunctive': {
    level: 4,
    structure: 'I suggest/recommend that + S + base verb (no -s)',
    questions: [
      { wrong: 'I suggest that he studies harder.', correct: 'I suggest that he study harder.', explanation: 'Subjunctive mood: after suggest/recommend/insist/demand, use base verb (no -s/es).' },
      { wrong: 'The doctor recommended that she takes rest.', correct: 'The doctor recommended that she take rest.', explanation: 'After "recommend that", use base form regardless of subject: "she take".' },
      { wrong: 'It is essential that he is present.', correct: 'It is essential that he be present.', explanation: 'Subjunctive after "essential that": use base form "be", not "is".' },
    ]
  },

  'Reduced Relative Clauses': {
    level: 4,
    structure: 'V-ing (active) / V3 (passive) — replacing who/which + verb',
    questions: [
      { wrong: 'The woman which is standing there is my teacher.', correct: 'The woman standing there is my teacher.', explanation: 'Reduce "who/which is + V-ing" → just V-ing: "standing there".' },
      { wrong: 'The letter which was written by him arrived today.', correct: 'The letter written by him arrived today.', explanation: 'Reduce "which was + V-ed" → just V-ed (past participle): "written by him".' },
      { wrong: 'Students who study hard will succeed.', correct: 'Students studying hard will succeed.', explanation: 'Reduce "who + V" → V-ing: "students studying hard".' },
    ]
  }
};

export const VOCABULARY = [
  { word: 'Treasure', type: 'noun', meaning: 'Valuable objects such as gold, jewels, or money.', example: 'They found a hidden treasure buried in the sand.', synonyms: ['wealth', 'fortune', 'riches'], collocations: ['treasure chest', 'hidden treasure', 'treasure hunt'] },
  { word: 'Ambitious', type: 'adjective', meaning: 'Having a strong desire and determination to succeed.', example: 'She is an ambitious student who works hard every day.', synonyms: ['driven', 'determined', 'aspiring'], collocations: ['ambitious plan', 'highly ambitious', 'ambitious goal'] },
  { word: 'Advocate', type: 'verb/noun', meaning: 'To publicly support or recommend a cause; a person who supports.', example: 'He advocates for better education in rural areas.', synonyms: ['support', 'champion', 'promote'], collocations: ['advocate for', 'strong advocate', 'advocate change'] },
  { word: 'Flourish', type: 'verb', meaning: 'To grow or develop in a healthy or vigorous way.', example: 'Businesses flourish when the economy is stable.', synonyms: ['thrive', 'prosper', 'bloom'], collocations: ['flourish under', 'continue to flourish', 'flourish in'] },
  { word: 'Substantial', type: 'adjective', meaning: 'Of considerable importance, size, or worth.', example: 'She earned a substantial income from her investments.', synonyms: ['significant', 'considerable', 'large'], collocations: ['substantial amount', 'substantial evidence', 'substantial progress'] },
  { word: 'Dedicate', type: 'verb', meaning: 'To devote time or effort to a particular task or purpose.', example: 'He dedicated his life to helping the poor.', synonyms: ['devote', 'commit', 'pledge'], collocations: ['dedicated to', 'fully dedicated', 'dedicate time'] },
  { word: 'Innovative', type: 'adjective', meaning: 'Featuring new methods; advanced and original.', example: 'The company launched an innovative product.', synonyms: ['creative', 'novel', 'groundbreaking'], collocations: ['innovative approach', 'innovative solution', 'highly innovative'] },
  { word: 'Perseverance', type: 'noun', meaning: 'Continued effort despite difficulty or delay.', example: 'Her perseverance helped her pass the exam.', synonyms: ['persistence', 'determination', 'tenacity'], collocations: ['perseverance pays off', 'show perseverance', 'require perseverance'] },
  { word: 'Collaborate', type: 'verb', meaning: 'To work jointly with others toward a shared goal.', example: 'Scientists collaborate across countries to find cures.', synonyms: ['cooperate', 'partner', 'work together'], collocations: ['collaborate with', 'collaborate on', 'closely collaborate'] },
  { word: 'Comprehend', type: 'verb', meaning: 'To understand something fully.', example: 'She struggled to comprehend the complex instructions.', synonyms: ['understand', 'grasp', 'perceive'], collocations: ['fully comprehend', 'fail to comprehend', 'difficult to comprehend'] },
  { word: 'Eloquent', type: 'adjective', meaning: 'Fluent or persuasive in speaking or writing.', example: 'He gave an eloquent speech that moved everyone.', synonyms: ['articulate', 'expressive', 'fluent'], collocations: ['eloquent speaker', 'eloquent speech', 'highly eloquent'] },
  { word: 'Inevitable', type: 'adjective', meaning: 'Certain to happen; unavoidable.', example: 'Change is inevitable in every aspect of life.', synonyms: ['unavoidable', 'certain', 'inescapable'], collocations: ['inevitable outcome', 'seem inevitable', 'all but inevitable'] },
  { word: 'Prioritize', type: 'verb', meaning: 'To treat something as more important than others.', example: 'You need to prioritize your health above everything.', synonyms: ['rank', 'order', 'emphasize'], collocations: ['prioritize tasks', 'prioritize safety', 'need to prioritize'] },
  { word: 'Resilient', type: 'adjective', meaning: 'Able to recover quickly from difficulties.', example: 'Children are more resilient than adults think.', synonyms: ['tough', 'adaptable', 'strong'], collocations: ['resilient community', 'highly resilient', 'become more resilient'] },
  { word: 'Skeptical', type: 'adjective', meaning: 'Not easily convinced; having doubts or reservations.', example: 'She was skeptical about his new plan.', synonyms: ['doubtful', 'unconvinced', 'suspicious'], collocations: ['skeptical about', 'remain skeptical', 'highly skeptical'] },
  { word: 'Sustainable', type: 'adjective', meaning: 'Able to be maintained at a certain rate without depleting resources.', example: 'We need sustainable energy solutions for the future.', synonyms: ['eco-friendly', 'viable', 'renewable'], collocations: ['sustainable development', 'sustainable energy', 'sustainable growth'] },
  { word: 'Transparent', type: 'adjective', meaning: 'Easy to perceive; open and honest.', example: 'The government must be transparent about its policies.', synonyms: ['clear', 'open', 'honest'], collocations: ['transparent process', 'fully transparent', 'transparent about'] },
  { word: 'Vulnerable', type: 'adjective', meaning: 'Exposed to the possibility of being attacked or harmed.', example: 'Elderly people are vulnerable to scams.', synonyms: ['at risk', 'exposed', 'susceptible'], collocations: ['vulnerable to', 'highly vulnerable', 'vulnerable population'] },
  { word: 'Accumulate', type: 'verb', meaning: 'To gather together or acquire an increasing number of things.', example: 'Dust accumulated on the shelves over months.', synonyms: ['gather', 'collect', 'amass'], collocations: ['accumulate wealth', 'rapidly accumulate', 'accumulate experience'] },
  { word: 'Controversial', type: 'adjective', meaning: 'Giving rise to disagreement or public debate.', example: 'The new law is highly controversial.', synonyms: ['debatable', 'disputed', 'contentious'], collocations: ['controversial issue', 'highly controversial', 'controversial decision'] },
];

export const GRAMMAR_LIBRARY = [
  { id: 'ps', title: 'Present Simple', level: 1, desc: 'Facts, habits, and routines', structure: 'S + V(s/es) | S + do/does not + V', explanation: 'Use Present Simple for: 1) Facts and general truths (Water boils at 100°C). 2) Habits and routines (I go to school every day). 3) Scheduled future events (The train leaves at 8 AM). Key: add -s/-es for he/she/it.', examples: ['She works at a hospital.', 'He doesn\'t drink coffee.', 'Does the shop open at 9?'] },
  { id: 'pc', title: 'Present Continuous', level: 1, desc: 'Actions happening now or temporarily', structure: 'S + am/is/are + V-ing', explanation: 'Use Present Continuous for: 1) Actions happening right now (I am writing now). 2) Temporary situations (She is staying with us this week). 3) Future arrangements (We are meeting tomorrow). NOT used with stative verbs (know, want, love, believe).', examples: ['He is watching TV now.', 'They are not studying.', 'Are you coming to the party?'] },
  { id: 'past', title: 'Past Simple', level: 1, desc: 'Completed actions in the past', structure: 'S + V2 | S + did not + V | Did + S + V?', explanation: 'Use Past Simple for: 1) Completed actions at a specific time in the past. 2) A series of past actions. 3) Past habits (used to). Regular verbs add -ed. Many common verbs are irregular (go→went, see→saw, buy→bought).', examples: ['She visited Paris last year.', 'I didn\'t sleep well.', 'Did you hear the news?'] },
  { id: 'pp', title: 'Present Perfect', level: 2, desc: 'Past actions with present relevance', structure: 'S + have/has + V3 (past participle)', explanation: 'Use Present Perfect for: 1) Experiences (I have been to Japan). 2) Actions with present result (She has lost her keys). 3) With "for" and "since" for ongoing situations. 4) Recent past (I have just finished). Time markers: already, yet, ever, never, just, for, since.', examples: ['I have never tried sushi.', 'She has lived here for 5 years.', 'Have you finished yet?'] },
  { id: 'passive', title: 'Passive Voice', level: 2, desc: 'Focus on the action, not the actor', structure: 'S + be + V3 | by + agent (optional)', explanation: 'Use Passive Voice when: 1) The agent is unknown or unimportant. 2) You want to focus on what happened, not who did it. 3) In formal/academic writing. Active: "They built the bridge." → Passive: "The bridge was built."', examples: ['This building was built in 1900.', 'English is spoken worldwide.', 'The report will be submitted tomorrow.'] },
  { id: 'rel', title: 'Relative Clauses', level: 2, desc: 'Add information about nouns', structure: 'who (person) | which (thing) | where (place) | whose (possession)', explanation: 'Defining relative clauses: Essential information (no commas). Non-defining: Extra info (use commas). "who/that" for people. "which/that" for things. "where" for places. "whose" for possession. "when" for time. You can omit "that/which/who" when they are the object.', examples: ['The man who called you is here.', 'This is the book which changed my life.', 'She lives in a city where it never snows.'] },
  { id: 'cond', title: 'Conditionals', level: 3, desc: 'Express possibilities and hypotheticals', structure: 'Type 0/1: present | Type 2: past | Type 3: past perfect', explanation: 'Type 0: General truth (If you heat water, it boils). Type 1: Real possibility (If it rains, I will stay home). Type 2: Unreal present (If I were rich, I would travel). Type 3: Unreal past (If I had known, I would have come). Mixed: If I had studied (Type 3 if) I would be passing now (Type 2 main).', examples: ['If it rains, we will cancel the trip.', 'If I were you, I would apologize.', 'If she had studied, she would have passed.'] },
  { id: 'gerund', title: 'Gerund vs Infinitive', level: 3, desc: 'Knowing which verb form to use', structure: 'Gerund: V-ing | Infinitive: to + V', explanation: 'Verbs followed by Gerund: enjoy, avoid, finish, suggest, mind, consider, practice, deny, miss. Verbs followed by Infinitive: want, decide, plan, hope, promise, agree, manage, refuse, expect. Some verbs take both but with different meanings: "stop smoking" (quit) vs "stop to smoke" (pause).', examples: ['I enjoy listening to music.', 'She decided to leave early.', 'He stopped eating sugar.'] },
  { id: 'inversion', title: 'Inversion', level: 4, desc: 'Inverted word order for emphasis', structure: 'Neg. adv. + Aux + S + V', explanation: 'Inversion is used after negative adverbials for emphasis. Common triggers: Never, Rarely, Seldom, Hardly, Scarcely, Not only, No sooner, Only then, Little did. This is common in formal writing and speech. The auxiliary verb comes BEFORE the subject.', examples: ['Never have I seen such a beautiful sunset.', 'Rarely does she arrive on time.', 'Not only did he lie, but he also cheated.'] },
  { id: 'subj', title: 'Subjunctive Mood', level: 4, desc: 'Express wishes, demands, suggestions', structure: 'S + suggest/insist/demand + that + S + base verb', explanation: 'The subjunctive uses the base form of the verb (no -s for third person). Used after: suggest, recommend, insist, demand, require, request, ask + that. Also used in fixed expressions: If I were you..., It is essential that...', examples: ['I suggest that he study harder.', 'She demanded that the work be done.', 'It is vital that everyone be present.'] },
];
