import { PrismaClient, Operator, UserRole, SubscriptionStatus, Difficulty, AnswerOption } from '@prisma/client';
import bcrypt from 'bcrypt'; // or bcryptjs if using that

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing database...');
  // Delete in correct order to respect foreign keys
  await prisma.smsLog.deleteMany();
  await prisma.dailyScore.deleteMany();
  await prisma.quizAnswer.deleteMany();
  await prisma.quizSession.deleteMany();
  await prisma.subscriptionTransaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.question.deleteMany();
  await prisma.section.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.subject.deleteMany();
  console.log('Database cleaned!');

  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Creating users...');
  const adminNumber = process.env.ADMIN_MOBILE || '01800000000';
  await prisma.user.create({
    data: {
      mobileNumber: adminNumber,
      passwordHash,
      name: 'Admin User',
      operator: Operator.ROBI,
      role: UserRole.ADMIN,
      isActive: true,
    }
  });

  const subUser = await prisma.user.create({
    data: {
      mobileNumber: '01811111111',
      passwordHash,
      name: 'Subscriber User',
      operator: Operator.ROBI,
      role: UserRole.USER,
      isActive: true,
      subscriptions: {
        create: {
          operator: Operator.ROBI,
          status: SubscriptionStatus.ACTIVE,
          subscriptionStart: new Date(),
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }
      }
    }
  });

  const freeUser = await prisma.user.create({
    data: {
      mobileNumber: '01822222222',
      passwordHash,
      name: 'Free User',
      operator: Operator.AIRTEL,
      role: UserRole.USER,
      isActive: true,
      subscriptions: {
        create: {
          operator: Operator.AIRTEL,
          status: SubscriptionStatus.INACTIVE,
        }
      }
    }
  });

  console.log('Creating Subjects, Chapters, Sections, and Questions...');

  const subjectsData = [
    {
      nameEn: 'Physics',
      icon: '⚛️',
      color: '#6366f1',
      chapters: [
        {
          nameEn: 'Mechanics',
          sections: [{
            nameEn: 'Motion',
            questions: [
              { q: 'What is the SI unit of velocity?', a: 'm/s', b: 'm/s²', c: 'N', d: 'J', correct: 'A', exp: 'The standard international unit for velocity is meters per second (m/s).', diff: 'EASY', marks: 1 },
              { q: 'Which of Newton\\'s laws is the law of inertia?', a: 'First Law', b: 'Second Law', c: 'Third Law', d: 'Law of Gravitation', correct: 'A', exp: 'Newton\\'s First Law states an object remains at rest or in uniform motion unless acted upon by a force.', diff: 'EASY', marks: 1 },
              { q: 'Acceleration is defined as the rate of change of:', a: 'Displacement', b: 'Velocity', c: 'Position', d: 'Force', correct: 'B', exp: 'Acceleration is the time derivative of velocity.', diff: 'MEDIUM', marks: 2 },
              { q: 'A car goes from 0 to 20 m/s in 5 seconds. What is its acceleration?', a: '2 m/s²', b: '4 m/s²', c: '5 m/s²', d: '10 m/s²', correct: 'B', exp: 'a = (v - u)/t = (20 - 0)/5 = 4 m/s².', diff: 'MEDIUM', marks: 2 },
              { q: 'If the net force on an object is zero, its acceleration is:', a: 'Zero', b: 'Infinite', c: 'Constant and non-zero', d: 'Negative', correct: 'A', exp: 'F = ma. If F=0, then a must be 0 (since m is non-zero).', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Electricity',
          sections: [{
            nameEn: 'Current Electricity',
            questions: [
              { q: 'What is the unit of electrical resistance?', a: 'Ampere', b: 'Volt', c: 'Ohm', d: 'Watt', correct: 'C', exp: 'The unit of electrical resistance is the Ohm (Ω).', diff: 'EASY', marks: 1 },
              { q: 'Ohm\\'s law states that:', a: 'V = I/R', b: 'V = I+R', c: 'V = IR', d: 'V = I-R', correct: 'C', exp: 'Voltage equals current multiplied by resistance.', diff: 'MEDIUM', marks: 2 },
              { q: 'Two 4 Ohm resistors in series have a total resistance of:', a: '2 Ohm', b: '4 Ohm', c: '8 Ohm', d: '16 Ohm', correct: 'C', exp: 'R_total = R1 + R2 = 4 + 4 = 8 Ohm.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which instrument is used to measure current?', a: 'Voltmeter', b: 'Ammeter', c: 'Galvanometer', d: 'Ohmmeter', correct: 'B', exp: 'An ammeter is connected in series to measure the current.', diff: 'EASY', marks: 1 },
              { q: 'Power (P) in an electrical circuit is given by:', a: 'P = VI', b: 'P = V/I', c: 'P = I/V', d: 'P = V+I', correct: 'A', exp: 'Electrical power is the product of voltage and current.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Optics',
          sections: [{
            nameEn: 'Reflection',
            questions: [
              { q: 'The angle of incidence is equal to the angle of reflection.', a: 'True for all mirrors', b: 'True only for plane mirrors', c: 'False', d: 'True only for curved mirrors', correct: 'A', exp: 'This is the universal law of reflection.', diff: 'EASY', marks: 1 },
              { q: 'What type of mirror is used as a rear-view mirror in cars?', a: 'Concave', b: 'Convex', c: 'Plane', d: 'Cylindrical', correct: 'B', exp: 'Convex mirrors provide a wider field of view.', diff: 'MEDIUM', marks: 2 },
              { q: 'The focal length of a plane mirror is:', a: 'Zero', b: 'Infinity', c: 'Negative', d: 'Positive', correct: 'B', exp: 'A plane mirror acts like a spherical mirror of infinite radius, thus infinite focal length.', diff: 'HARD', marks: 3 },
              { q: 'When light reflects off a rough surface, it is called:', a: 'Regular reflection', b: 'Diffuse reflection', c: 'Refraction', d: 'Dispersion', correct: 'B', exp: 'Rough surfaces scatter light in many directions (diffuse reflection).', diff: 'EASY', marks: 1 },
              { q: 'If the radius of curvature of a mirror is 20 cm, its focal length is:', a: '10 cm', b: '20 cm', c: '40 cm', d: '5 cm', correct: 'A', exp: 'Focal length is half of the radius of curvature (f = R/2).', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Chemistry',
      icon: '🧪',
      color: '#ec4899',
      chapters: [
        {
          nameEn: 'Periodic Table',
          sections: [{
            nameEn: 'Elements',
            questions: [
              { q: 'What is the chemical symbol for Gold?', a: 'Au', b: 'Ag', c: 'Gd', d: 'Go', correct: 'A', exp: 'Au comes from the Latin word aurum, meaning gold.', diff: 'EASY', marks: 1 },
              { q: 'Which group contains the noble gases?', a: 'Group 1', b: 'Group 17', c: 'Group 18', d: 'Group 2', correct: 'C', exp: 'Group 18 elements are inert or noble gases.', diff: 'MEDIUM', marks: 2 },
              { q: 'The most electronegative element is:', a: 'Oxygen', b: 'Fluorine', c: 'Chlorine', d: 'Nitrogen', correct: 'B', exp: 'Fluorine has the highest electronegativity on the Pauling scale.', diff: 'HARD', marks: 3 },
              { q: 'What is the atomic number of Carbon?', a: '6', b: '12', c: '14', d: '8', correct: 'A', exp: 'Carbon has 6 protons, giving it atomic number 6.', diff: 'EASY', marks: 1 },
              { q: 'Which element is liquid at room temperature?', a: 'Iron', b: 'Mercury', c: 'Copper', d: 'Lead', correct: 'B', exp: 'Mercury is the only metal that is liquid at standard conditions.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Chemical Reactions',
          sections: [{
            nameEn: 'Types of Reactions',
            questions: [
              { q: 'A reaction that releases heat is called:', a: 'Endothermic', b: 'Exothermic', c: 'Isothermic', d: 'Adiabatic', correct: 'B', exp: 'Exothermic reactions release energy in the form of heat.', diff: 'EASY', marks: 1 },
              { q: 'Which of the following is a redox reaction?', a: 'Neutralization', b: 'Precipitation', c: 'Combustion', d: 'Double displacement', correct: 'C', exp: 'Combustion involves oxidation of the fuel and reduction of oxygen.', diff: 'MEDIUM', marks: 2 },
              { q: 'In an acid-base neutralization, the products are usually:', a: 'Salt and Water', b: 'Gas and Water', c: 'Base and Acid', d: 'Metal and Gas', correct: 'A', exp: 'Acid + Base → Salt + Water.', diff: 'EASY', marks: 1 },
              { q: 'Oxidation involves the:', a: 'Gain of electrons', b: 'Loss of electrons', c: 'Gain of protons', d: 'Loss of neutrons', correct: 'B', exp: 'OIL RIG (Oxidation Is Loss, Reduction Is Gain of electrons).', diff: 'HARD', marks: 3 },
              { q: 'What acts as a catalyst in the Haber process?', a: 'Nickel', b: 'Iron', c: 'Platinum', d: 'Vanadium', correct: 'B', exp: 'Iron powder is used as a catalyst to produce ammonia.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Organic Chemistry',
          sections: [{
            nameEn: 'Hydrocarbons',
            questions: [
              { q: 'Alkanes have the general formula:', a: 'CnH2n', b: 'CnH2n+2', c: 'CnH2n-2', d: 'CnHn', correct: 'B', exp: 'Alkanes are saturated hydrocarbons with formula CnH2n+2.', diff: 'MEDIUM', marks: 2 },
              { q: 'The simplest alkene is:', a: 'Methane', b: 'Ethene', c: 'Propene', d: 'Ethyne', correct: 'B', exp: 'Ethene (C2H4) is the simplest alkene as you need at least two carbons for a double bond.', diff: 'HARD', marks: 3 },
              { q: 'Which compound contains a triple bond?', a: 'Alkane', b: 'Alkene', c: 'Alkyne', d: 'Alcohol', correct: 'C', exp: 'Alkynes contain carbon-carbon triple bonds.', diff: 'EASY', marks: 1 },
              { q: 'What is the main component of natural gas?', a: 'Ethane', b: 'Methane', c: 'Propane', d: 'Butane', correct: 'B', exp: 'Methane makes up the vast majority of natural gas.', diff: 'EASY', marks: 1 },
              { q: 'Aromatic hydrocarbons contain:', a: 'Straight chains', b: 'Benzene rings', c: 'Triple bonds', d: 'Esters', correct: 'B', exp: 'Aromatic compounds are characterized by containing a benzene ring.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Mathematics',
      icon: '➗',
      color: '#f59e0b',
      chapters: [
        {
          nameEn: 'Algebra',
          sections: [{
            nameEn: 'Equations',
            questions: [
              { q: 'Solve for x: 2x + 5 = 15', a: '5', b: '10', c: '15', d: '20', correct: 'A', exp: '2x = 10, so x = 5.', diff: 'EASY', marks: 1 },
              { q: 'What is the discriminant of a quadratic equation ax² + bx + c = 0?', a: 'b² - 4ac', b: 'b² + 4ac', c: '2a', d: 'a² + b²', correct: 'A', exp: 'The discriminant is b² - 4ac, which determines the nature of the roots.', diff: 'MEDIUM', marks: 2 },
              { q: 'If x² - 9 = 0, x can be:', a: '3 only', b: '-3 only', c: '3 or -3', d: '9 or -9', correct: 'C', exp: 'Taking the square root of 9 yields both 3 and -3.', diff: 'EASY', marks: 1 },
              { q: 'Which of the following is a linear equation?', a: 'y = x²', b: 'y = 2x + 3', c: 'y = 1/x', d: 'y = sin(x)', correct: 'B', exp: 'A linear equation has variables raised only to the first power.', diff: 'EASY', marks: 1 },
              { q: 'Solve the system: x+y=5, x-y=1', a: 'x=2, y=3', b: 'x=3, y=2', c: 'x=4, y=1', d: 'x=1, y=4', correct: 'B', exp: 'Adding the equations gives 2x=6, so x=3. Then y=2.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Geometry',
          sections: [{
            nameEn: 'Triangles',
            questions: [
              { q: 'The sum of interior angles of a triangle is:', a: '90°', b: '180°', c: '270°', d: '360°', correct: 'B', exp: 'A triangle always has interior angles summing to 180 degrees.', diff: 'EASY', marks: 1 },
              { q: 'In a right-angled triangle, if sides are 3 and 4, the hypotenuse is:', a: '5', b: '6', c: '7', d: '8', correct: 'A', exp: 'According to Pythagoras theorem: √(3² + 4²) = √25 = 5.', diff: 'MEDIUM', marks: 2 },
              { q: 'An equilateral triangle has all angles equal to:', a: '45°', b: '60°', c: '90°', d: '120°', correct: 'B', exp: '180 / 3 = 60 degrees.', diff: 'EASY', marks: 1 },
              { q: 'Area of a triangle with base 10 and height 5 is:', a: '25', b: '50', c: '15', d: '100', correct: 'A', exp: 'Area = 0.5 * base * height = 0.5 * 10 * 5 = 25.', diff: 'MEDIUM', marks: 2 },
              { q: 'If two sides of a triangle are equal, it is called:', a: 'Scalene', b: 'Equilateral', c: 'Isosceles', d: 'Right', correct: 'C', exp: 'An isosceles triangle has two equal sides.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Calculus',
          sections: [{
            nameEn: 'Differentiation',
            questions: [
              { q: 'What is the derivative of x²?', a: 'x', b: '2x', c: 'x³/3', d: '2', correct: 'B', exp: 'Using the power rule, d/dx(x^n) = n*x^(n-1).', diff: 'EASY', marks: 1 },
              { q: 'The derivative of a constant is:', a: '1', b: '0', c: 'The constant itself', d: 'Infinity', correct: 'B', exp: 'A constant does not change, so its rate of change (derivative) is zero.', diff: 'EASY', marks: 1 },
              { q: 'What is the derivative of sin(x)?', a: 'cos(x)', b: '-cos(x)', c: 'sin(x)', d: '-sin(x)', correct: 'A', exp: 'The derivative of sine is cosine.', diff: 'MEDIUM', marks: 2 },
              { q: 'The product rule for derivatives is:', a: '(uv)\\' = u\\'v + uv\\'', b: '(uv)\\' = u\\'v\\'', c: '(uv)\\' = u\\'v - uv\\'', d: '(uv)\\' = u+v', correct: 'A', exp: 'The product rule is d(uv)/dx = v(du/dx) + u(dv/dx).', diff: 'HARD', marks: 3 },
              { q: 'If f(x) = e^x, then f\\'(x) is:', a: 'xe^(x-1)', b: 'e^x', c: 'ln(x)', d: '1/e^x', correct: 'B', exp: 'The exponential function e^x is its own derivative.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Biology',
      icon: '🧬',
      color: '#10b981',
      chapters: [
        {
          nameEn: 'Cell Biology',
          sections: [{
            nameEn: 'Cell Structure',
            questions: [
              { q: 'What is the powerhouse of the cell?', a: 'Nucleus', b: 'Ribosome', c: 'Mitochondria', d: 'Golgi body', correct: 'C', exp: 'Mitochondria produce most of the cell\\'s ATP.', diff: 'EASY', marks: 1 },
              { q: 'Which organelle is responsible for photosynthesis in plants?', a: 'Chloroplast', b: 'Vacuole', c: 'Mitochondria', d: 'Cell wall', correct: 'A', exp: 'Chloroplasts contain chlorophyll where photosynthesis occurs.', diff: 'EASY', marks: 1 },
              { q: 'Prokaryotic cells lack:', a: 'DNA', b: 'A true nucleus', c: 'Cell membrane', d: 'Ribosomes', correct: 'B', exp: 'Prokaryotes do not have a membrane-bound nucleus.', diff: 'MEDIUM', marks: 2 },
              { q: 'Protein synthesis occurs in the:', a: 'Lysosome', b: 'Ribosome', c: 'Nucleus', d: 'Vacuole', correct: 'B', exp: 'Ribosomes are the site of translation where proteins are made.', diff: 'MEDIUM', marks: 2 },
              { q: 'The fluid mosaic model describes the structure of:', a: 'Cell membrane', b: 'DNA', c: 'Cell wall', d: 'Cytoplasm', correct: 'A', exp: 'It describes the plasma membrane as a mosaic of components.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Genetics',
          sections: [{
            nameEn: 'DNA & Inheritance',
            questions: [
              { q: 'Who is known as the father of genetics?', a: 'Charles Darwin', b: 'Gregor Mendel', c: 'James Watson', d: 'Louis Pasteur', correct: 'B', exp: 'Mendel discovered the fundamental laws of inheritance.', diff: 'EASY', marks: 1 },
              { q: 'What does DNA stand for?', a: 'Deoxyribonucleic acid', b: 'Ribonucleic acid', c: 'Di-nucleic acid', d: 'Deoxynitric acid', correct: 'A', exp: 'DNA is deoxyribonucleic acid.', diff: 'EASY', marks: 1 },
              { q: 'In DNA, Adenine pairs with:', a: 'Guanine', b: 'Cytosine', c: 'Thymine', d: 'Uracil', correct: 'C', exp: 'A pairs with T in DNA molecules.', diff: 'MEDIUM', marks: 2 },
              { q: 'The visible trait expressed by an organism is its:', a: 'Genotype', b: 'Phenotype', c: 'Allele', d: 'Chromosome', correct: 'B', exp: 'Phenotype refers to the observable physical properties.', diff: 'MEDIUM', marks: 2 },
              { q: 'Humans have how many pairs of chromosomes?', a: '21', b: '22', c: '23', d: '24', correct: 'C', exp: 'Humans have 46 chromosomes, arranged in 23 pairs.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Human Body',
          sections: [{
            nameEn: 'Circulatory System',
            questions: [
              { q: 'Which organ pumps blood throughout the human body?', a: 'Lungs', b: 'Liver', c: 'Heart', d: 'Brain', correct: 'C', exp: 'The heart acts as a pump for the circulatory system.', diff: 'EASY', marks: 1 },
              { q: 'What is the main function of red blood cells?', a: 'Fight infection', b: 'Carry oxygen', c: 'Clot blood', d: 'Digest food', correct: 'B', exp: 'RBCs contain hemoglobin which binds and carries oxygen.', diff: 'EASY', marks: 1 },
              { q: 'Which vessels carry blood away from the heart?', a: 'Veins', b: 'Arteries', c: 'Capillaries', d: 'Lymphatics', correct: 'B', exp: 'Arteries carry oxygen-rich blood away from the heart (usually).', diff: 'MEDIUM', marks: 2 },
              { q: 'The normal resting heart rate for adults is around:', a: '30-40 bpm', b: '60-100 bpm', c: '120-150 bpm', d: '150-180 bpm', correct: 'B', exp: 'A normal resting heart rate is between 60 and 100 beats per minute.', diff: 'HARD', marks: 3 },
              { q: 'Which part of the blood helps in clotting?', a: 'Plasma', b: 'Red Blood Cells', c: 'White Blood Cells', d: 'Platelets', correct: 'D', exp: 'Platelets clump together to form clots and stop bleeding.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'General Science',
      icon: '🔬',
      color: '#8b5cf6',
      chapters: [
        {
          nameEn: 'Scientific Method',
          sections: [{
            nameEn: 'Basics',
            questions: [
              { q: 'What is the first step of the scientific method?', a: 'Experiment', b: 'Hypothesis', c: 'Observation', d: 'Conclusion', correct: 'C', exp: 'Observation leads to asking questions.', diff: 'EASY', marks: 1 },
              { q: 'A proposed explanation for an observation is called:', a: 'Law', b: 'Theory', c: 'Hypothesis', d: 'Fact', correct: 'C', exp: 'A hypothesis is an educated guess to be tested.', diff: 'EASY', marks: 1 },
              { q: 'In an experiment, the variable that you change is the:', a: 'Independent variable', b: 'Dependent variable', c: 'Control', d: 'Constant', correct: 'A', exp: 'The independent variable is the one manipulated by the researcher.', diff: 'MEDIUM', marks: 2 },
              { q: 'A well-substantiated explanation of an aspect of the natural world is a:', a: 'Hypothesis', b: 'Scientific Theory', c: 'Observation', d: 'Guess', correct: 'B', exp: 'Theories are based on bodies of facts confirmed through observation and experiment.', diff: 'MEDIUM', marks: 2 },
              { q: 'The group in an experiment that does not receive the treatment is:', a: 'Experimental group', b: 'Control group', c: 'Placebo group', d: 'Variable group', correct: 'B', exp: 'The control group provides a baseline for comparison.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Famous Inventions',
          sections: [{
            nameEn: 'Key Inventions',
            questions: [
              { q: 'Who invented the telephone?', a: 'Thomas Edison', b: 'Alexander Graham Bell', c: 'Nikola Tesla', d: 'Albert Einstein', correct: 'B', exp: 'Alexander Graham Bell is credited with patenting the first practical telephone.', diff: 'EASY', marks: 1 },
              { q: 'Who is credited with inventing the light bulb?', a: 'Thomas Edison', b: 'Benjamin Franklin', c: 'Michael Faraday', d: 'James Watt', correct: 'A', exp: 'Edison developed the first commercially practical incandescent light bulb.', diff: 'EASY', marks: 1 },
              { q: 'The World Wide Web was invented by:', a: 'Bill Gates', b: 'Steve Jobs', c: 'Tim Berners-Lee', d: 'Mark Zuckerberg', correct: 'C', exp: 'Tim Berners-Lee invented the WWW in 1989.', diff: 'MEDIUM', marks: 2 },
              { q: 'Who discovered penicillin?', a: 'Marie Curie', b: 'Louis Pasteur', c: 'Alexander Fleming', d: 'Jonas Salk', correct: 'C', exp: 'Fleming discovered penicillin, the first true antibiotic, in 1928.', diff: 'MEDIUM', marks: 2 },
              { q: 'The steam engine was greatly improved by:', a: 'James Watt', b: 'Isaac Newton', c: 'Galileo Galilei', d: 'Henry Ford', correct: 'A', exp: 'James Watt improved the Newcomen steam engine with his Watt steam engine.', diff: 'HARD', marks: 3 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'History',
      icon: '📜',
      color: '#78716c',
      chapters: [
        {
          nameEn: 'Ancient Civilizations',
          sections: [{
            nameEn: 'Key Events',
            questions: [
              { q: 'Which river is associated with the ancient Egyptian civilization?', a: 'Tigris', b: 'Euphrates', c: 'Nile', d: 'Indus', correct: 'C', exp: 'Ancient Egypt developed along the Nile River.', diff: 'EASY', marks: 1 },
              { q: 'The Great Pyramid of Giza was built for which pharaoh?', a: 'Tutankhamun', b: 'Ramses II', c: 'Khufu', d: 'Cleopatra', correct: 'C', exp: 'It was built as a tomb for the Fourth Dynasty pharaoh Khufu.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which ancient civilization built the city of Machu Picchu?', a: 'Aztec', b: 'Maya', c: 'Inca', d: 'Olmec', correct: 'C', exp: 'Machu Picchu is an Incan citadel set high in the Andes.', diff: 'HARD', marks: 3 },
              { q: 'The first Olympic Games were held in:', a: 'Rome', b: 'Athens', c: 'Sparta', d: 'Olympia', correct: 'D', exp: 'They were held in Olympia, Greece, in 776 BC.', diff: 'MEDIUM', marks: 2 },
              { q: 'Mesopotamia was located between which two rivers?', a: 'Nile and Amazon', b: 'Tigris and Euphrates', c: 'Yellow and Yangtze', d: 'Ganges and Indus', correct: 'B', exp: 'Mesopotamia translates to "the land between rivers" (Tigris and Euphrates).', diff: 'EASY', marks: 1 },
            ]
          }]
        },
        {
          nameEn: 'Modern History',
          sections: [{
            nameEn: '20th Century',
            questions: [
              { q: 'World War I began in what year?', a: '1914', b: '1918', c: '1939', d: '1945', correct: 'A', exp: 'WWI started in July 1914 following the assassination of Archduke Franz Ferdinand.', diff: 'EASY', marks: 1 },
              { q: 'Who was the British Prime Minister during most of World War II?', a: 'Neville Chamberlain', b: 'Winston Churchill', c: 'Clement Attlee', d: 'Margaret Thatcher', correct: 'B', exp: 'Churchill led Britain to victory in the Second World War.', diff: 'MEDIUM', marks: 2 },
              { q: 'The Cold War was primarily between the USA and:', a: 'China', b: 'Germany', c: 'Soviet Union', d: 'Japan', correct: 'C', exp: 'It was a period of geopolitical tension between the US and the USSR.', diff: 'EASY', marks: 1 },
              { q: 'The Berlin Wall fell in which year?', a: '1985', b: '1989', c: '1991', d: '1995', correct: 'B', exp: 'The Berlin Wall fell on November 9, 1989.', diff: 'HARD', marks: 3 },
              { q: 'Apartheid was a system of racial segregation in which country?', a: 'USA', b: 'South Africa', c: 'Australia', d: 'India', correct: 'B', exp: 'Apartheid was instituted in South Africa from 1948 to the early 1990s.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Ecology',
      icon: '🌿',
      color: '#22c55e',
      chapters: [
        {
          nameEn: 'Ecosystems',
          sections: [{
            nameEn: 'Types',
            questions: [
              { q: 'The primary energy source for most ecosystems is:', a: 'Geothermal energy', b: 'The Sun', c: 'Wind', d: 'Water', correct: 'B', exp: 'The Sun provides energy for photosynthesis, the base of most food webs.', diff: 'EASY', marks: 1 },
              { q: 'Organisms that make their own food are called:', a: 'Consumers', b: 'Decomposers', c: 'Producers', d: 'Scavengers', correct: 'C', exp: 'Producers (autotrophs) synthesize their own food.', diff: 'EASY', marks: 1 },
              { q: 'A community of living organisms interacting with their physical environment is a(n):', a: 'Population', b: 'Species', c: 'Ecosystem', d: 'Biome', correct: 'C', exp: 'An ecosystem includes both biotic and abiotic components.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which of these is an abiotic factor?', a: 'Trees', b: 'Animals', c: 'Bacteria', d: 'Temperature', correct: 'D', exp: 'Abiotic factors are non-living chemical and physical parts of the environment.', diff: 'MEDIUM', marks: 2 },
              { q: 'The largest ecosystem on Earth is the:', a: 'Rainforest', b: 'Desert', c: 'Marine ecosystem', d: 'Tundra', correct: 'C', exp: 'Marine ecosystems cover about 71% of Earth\\'s surface.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Conservation',
          sections: [{
            nameEn: 'Biodiversity',
            questions: [
              { q: 'Biodiversity refers to:', a: 'The number of species in an area', b: 'Only the animals in a zoo', c: 'The amount of biomass', d: 'The physical habitats', correct: 'A', exp: 'Biodiversity is the variety and variability of life on Earth.', diff: 'EASY', marks: 1 },
              { q: 'An endangered species is one that is:', a: 'Growing in population', b: 'At risk of extinction', c: 'Found everywhere', d: 'Not affected by humans', correct: 'B', exp: 'Endangered species face a very high risk of extinction in the wild.', diff: 'EASY', marks: 1 },
              { q: 'Which human activity contributes most to species extinction?', a: 'Hunting', b: 'Pollution', c: 'Habitat destruction', d: 'Climate change', correct: 'C', exp: 'Habitat loss is the greatest threat to biodiversity globally.', diff: 'MEDIUM', marks: 2 },
              { q: 'A species that plays a critical role in maintaining the structure of an ecological community is a:', a: 'Keystone species', b: 'Invasive species', c: 'Endemic species', d: 'Pioneer species', correct: 'A', exp: 'Without keystone species, the ecosystem would be dramatically different.', diff: 'HARD', marks: 3 },
              { q: 'Deforestation leads to:', a: 'Increased biodiversity', b: 'Soil erosion', c: 'More oxygen', d: 'Colder climates', correct: 'B', exp: 'Removing trees removes roots that hold soil in place.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Evolution',
      icon: '🦕',
      color: '#14b8a6',
      chapters: [
        {
          nameEn: 'Natural Selection',
          sections: [{
            nameEn: 'Mechanisms',
            questions: [
              { q: 'Who proposed the theory of evolution by natural selection?', a: 'Charles Darwin', b: 'Gregor Mendel', c: 'Jean-Baptiste Lamarck', d: 'Louis Pasteur', correct: 'A', exp: 'Darwin published "On the Origin of Species" in 1859.', diff: 'EASY', marks: 1 },
              { q: 'Natural selection acts upon:', a: 'Individuals', b: 'Populations', c: 'Communities', d: 'Ecosystems', correct: 'B', exp: 'Populations evolve over generations; individuals do not.', diff: 'MEDIUM', marks: 2 },
              { q: 'A trait that helps an organism survive and reproduce is called a(n):', a: 'Mutation', b: 'Adaptation', c: 'Vestige', d: 'Anomaly', correct: 'B', exp: 'Adaptations increase evolutionary fitness.', diff: 'EASY', marks: 1 },
              { q: 'Structures with different functions but similar anatomy (like a human arm and bat wing) are:', a: 'Analogous', b: 'Homologous', c: 'Vestigial', d: 'Convergent', correct: 'B', exp: 'Homologous structures indicate a common evolutionary ancestor.', diff: 'HARD', marks: 3 },
              { q: 'The random change in allele frequencies over time is known as:', a: 'Gene flow', b: 'Genetic drift', c: 'Mutation', d: 'Natural selection', correct: 'B', exp: 'Genetic drift affects small populations strongly through random chance events.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Human Evolution',
          sections: [{
            nameEn: 'Hominids',
            questions: [
              { q: 'Modern humans belong to the species:', a: 'Homo erectus', b: 'Homo neanderthalensis', c: 'Homo sapiens', d: 'Homo habilis', correct: 'C', exp: 'Homo sapiens means "wise man".', diff: 'EASY', marks: 1 },
              { q: 'The "Out of Africa" theory states that:', a: 'All life began in Africa', b: 'Modern humans originated in Africa and migrated', c: 'Neanderthals lived only in Africa', d: 'Humans migrated to Africa from Asia', correct: 'B', exp: 'Fossil and genetic evidence show human origins in Africa.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which early hominid is nicknamed "Handy Man" for tool use?', a: 'Australopithecus', b: 'Homo erectus', c: 'Homo habilis', d: 'Homo sapiens', correct: 'C', exp: 'Homo habilis is often associated with some of the earliest stone tools.', diff: 'HARD', marks: 3 },
              { q: 'Walking on two legs is known as:', a: 'Quadrupedalism', b: 'Bipedalism', c: 'Brachiation', d: 'Arboreal locomotion', correct: 'B', exp: 'Bipedalism is a defining characteristic of the hominin lineage.', diff: 'EASY', marks: 1 },
              { q: 'Neanderthals are most closely related to:', a: 'Chimpanzees', b: 'Modern Humans', c: 'Gorillas', d: 'Orangutans', correct: 'B', exp: 'Neanderthals were our closest extinct human relative.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'ICT / Computer Science',
      icon: '💻',
      color: '#3b82f6',
      chapters: [
        {
          nameEn: 'Programming',
          sections: [{
            nameEn: 'Fundamentals',
            questions: [
              { q: 'What does CPU stand for?', a: 'Central Process Unit', b: 'Computer Personal Unit', c: 'Central Processing Unit', d: 'Central Processor Unit', correct: 'C', exp: 'The CPU is the primary component of a computer that acts as its "brain".', diff: 'EASY', marks: 1 },
              { q: 'Which of these is a popular programming language?', a: 'Python', b: 'Cobra', c: 'Viper', d: 'Anaconda', correct: 'A', exp: 'Python is a widely used high-level programming language.', diff: 'EASY', marks: 1 },
              { q: 'A bug in computer science refers to:', a: 'A virus', b: 'An error in a program', c: 'A hardware component', d: 'A small insect inside the case', correct: 'B', exp: 'Software bugs cause programs to behave unexpectedly.', diff: 'MEDIUM', marks: 2 },
              { q: 'The binary number system consists of:', a: '0 to 9', b: '0 and 1', c: '1 to 10', d: 'Letters and numbers', correct: 'B', exp: 'Computers use binary (base-2) representing true/false or on/off states.', diff: 'MEDIUM', marks: 2 },
              { q: 'What does an algorithm mean?', a: 'A step-by-step procedure to solve a problem', b: 'A type of computer virus', c: 'A programming language', d: 'A hardware device', correct: 'A', exp: 'Algorithms are fundamental logic patterns in computer science.', diff: 'HARD', marks: 3 },
            ]
          }]
        },
        {
          nameEn: 'Networks',
          sections: [{
            nameEn: 'Internet Basics',
            questions: [
              { q: 'What does HTTP stand for?', a: 'HyperText Transfer Protocol', b: 'HyperText Transmission Protocol', c: 'HyperText Transfer Process', d: 'HyperText Transmission Process', correct: 'A', exp: 'HTTP is the foundation of data communication for the World Wide Web.', diff: 'EASY', marks: 1 },
              { q: 'An IP address is used to:', a: 'Identify devices on a network', b: 'Make websites faster', c: 'Store data', d: 'Prevent viruses', correct: 'A', exp: 'Every device needs a unique IP address to communicate over the Internet.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which protocol is used for secure communication over the web?', a: 'HTTP', b: 'FTP', c: 'HTTPS', d: 'SMTP', correct: 'C', exp: 'The "S" in HTTPS stands for Secure.', diff: 'EASY', marks: 1 },
              { q: 'What is a firewall?', a: 'A physical wall to prevent fires in server rooms', b: 'Software/Hardware that blocks unauthorized network access', c: 'A virus', d: 'A type of web browser', correct: 'B', exp: 'Firewalls establish a barrier between trusted and untrusted networks.', diff: 'HARD', marks: 3 },
              { q: 'DNS stands for:', a: 'Domain Name System', b: 'Digital Network Service', c: 'Data Network System', d: 'Domain Network Service', correct: 'A', exp: 'DNS translates human-readable domain names to IP addresses.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Astronomy',
      icon: '🌌',
      color: '#7c3aed',
      chapters: [
        {
          nameEn: 'Solar System',
          sections: [{
            nameEn: 'Planets',
            questions: [
              { q: 'Which planet is known as the Red Planet?', a: 'Venus', b: 'Mars', c: 'Jupiter', d: 'Saturn', correct: 'B', exp: 'Mars is red due to iron oxide (rust) on its surface.', diff: 'EASY', marks: 1 },
              { q: 'The largest planet in our solar system is:', a: 'Earth', b: 'Saturn', c: 'Jupiter', d: 'Neptune', correct: 'C', exp: 'Jupiter is a gas giant and the largest planet.', diff: 'EASY', marks: 1 },
              { q: 'Which planet is closest to the Sun?', a: 'Venus', b: 'Earth', c: 'Mercury', d: 'Mars', correct: 'C', exp: 'Mercury orbits at an average distance of 58 million km from the Sun.', diff: 'MEDIUM', marks: 2 },
              { q: 'How many moons does Mars have?', a: '0', b: '1', c: '2', d: '4', correct: 'C', exp: 'Mars has two small moons: Phobos and Deimos.', diff: 'HARD', marks: 3 },
              { q: 'Which planet is famous for its prominent ring system?', a: 'Jupiter', b: 'Saturn', c: 'Uranus', d: 'Neptune', correct: 'B', exp: 'Saturn\\'s rings are composed mainly of ice particles.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Stars',
          sections: [{
            nameEn: 'Stellar Evolution',
            questions: [
              { q: 'The Sun is a:', a: 'Planet', b: 'Comet', c: 'Star', d: 'Asteroid', correct: 'C', exp: 'The Sun is a main-sequence star.', diff: 'EASY', marks: 1 },
              { q: 'Stars generate energy through:', a: 'Nuclear fission', b: 'Nuclear fusion', c: 'Chemical burning', d: 'Radioactive decay', correct: 'B', exp: 'Stars fuse hydrogen into helium in their cores.', diff: 'MEDIUM', marks: 2 },
              { q: 'A supernova is:', a: 'A new star forming', b: 'An exploding star', c: 'A galaxy', d: 'A black hole', correct: 'B', exp: 'A supernova is the powerful and luminous explosion of a star.', diff: 'MEDIUM', marks: 2 },
              { q: 'What remains after a massive star goes supernova?', a: 'A white dwarf', b: 'A neutron star or black hole', c: 'A red giant', d: 'Nothing', correct: 'B', exp: 'The core collapses into either a neutron star or black hole depending on mass.', diff: 'HARD', marks: 3 },
              { q: 'The color of a star indicates its:', a: 'Age', b: 'Distance', c: 'Temperature', d: 'Size', correct: 'C', exp: 'Blue stars are hotter, while red stars are cooler.', diff: 'EASY', marks: 1 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Geography',
      icon: '🌍',
      color: '#0ea5e9',
      chapters: [
        {
          nameEn: 'Physical Geography',
          sections: [{
            nameEn: 'Landforms',
            questions: [
              { q: 'What is the highest mountain in the world?', a: 'K2', b: 'Mount Everest', c: 'Kangchenjunga', d: 'Makalu', correct: 'B', exp: 'Mount Everest peaks at 8,848 meters above sea level.', diff: 'EASY', marks: 1 },
              { q: 'The largest desert in the world (by area) is:', a: 'Sahara', b: 'Arabian', c: 'Antarctic', d: 'Gobi', correct: 'C', exp: 'Antarctica is a polar desert and the largest globally.', diff: 'HARD', marks: 3 },
              { q: 'Which is the longest river in the world?', a: 'Amazon', b: 'Nile', c: 'Yangtze', d: 'Mississippi', correct: 'B', exp: 'The Nile is traditionally considered the longest river.', diff: 'MEDIUM', marks: 2 },
              { q: 'A piece of land surrounded by water on three sides is a:', a: 'Island', b: 'Peninsula', c: 'Isthmus', d: 'Strait', correct: 'B', exp: 'Florida and Italy are examples of peninsulas.', diff: 'EASY', marks: 1 },
              { q: 'The deepest part of the world\\'s oceans is the:', a: 'Mariana Trench', b: 'Tonga Trench', c: 'Puerto Rico Trench', d: 'Java Trench', correct: 'A', exp: 'The Mariana Trench in the Pacific Ocean is the deepest oceanic trench.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Climate',
          sections: [{
            nameEn: 'Weather Systems',
            questions: [
              { q: 'The instrument used to measure atmospheric pressure is a:', a: 'Thermometer', b: 'Barometer', c: 'Anemometer', d: 'Hygrometer', correct: 'B', exp: 'Barometers measure air pressure, useful for predicting weather.', diff: 'MEDIUM', marks: 2 },
              { q: 'What does a hygrometer measure?', a: 'Wind speed', b: 'Rainfall', c: 'Humidity', d: 'Temperature', correct: 'C', exp: 'A hygrometer measures the amount of water vapor in the air.', diff: 'HARD', marks: 3 },
              { q: 'The boundary between two different air masses is called a:', a: 'Front', b: 'Trough', c: 'Ridge', d: 'Current', correct: 'A', exp: 'Weather fronts are where dramatic weather changes usually occur.', diff: 'MEDIUM', marks: 2 },
              { q: 'Which climate zone is located near the equator?', a: 'Polar', b: 'Temperate', c: 'Tropical', d: 'Continental', correct: 'C', exp: 'Tropical climates are hot and humid year-round.', diff: 'EASY', marks: 1 },
              { q: 'The Fujita scale measures the intensity of:', a: 'Earthquakes', b: 'Tornadoes', c: 'Hurricanes', d: 'Tsunamis', correct: 'B', exp: 'The Fujita (or Enhanced Fujita) scale classifies tornadoes based on damage.', diff: 'EASY', marks: 1 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'General Knowledge',
      icon: '💡',
      color: '#eab308',
      chapters: [
        {
          nameEn: 'World Facts',
          sections: [{
            nameEn: 'Countries & Capitals',
            questions: [
              { q: 'What is the capital of Bangladesh?', a: 'Dhaka', b: 'Chittagong', c: 'Sylhet', d: 'Rajshahi', correct: 'A', exp: 'Dhaka is the capital and largest city of Bangladesh.', diff: 'EASY', marks: 1 },
              { q: 'Which country has the largest population?', a: 'USA', b: 'India', c: 'China', d: 'Russia', correct: 'B', exp: 'As of recent estimates, India has surpassed China in population.', diff: 'MEDIUM', marks: 2 },
              { q: 'What is the currency of Japan?', a: 'Yuan', b: 'Won', c: 'Yen', d: 'Ringgit', correct: 'C', exp: 'The Japanese Yen is the official currency of Japan.', diff: 'EASY', marks: 1 },
              { q: 'Which is the smallest country in the world?', a: 'Monaco', b: 'Nauru', c: 'Vatican City', d: 'Tuvalu', correct: 'C', exp: 'Vatican City is an independent city-state enclaved within Rome, Italy.', diff: 'HARD', marks: 3 },
              { q: 'The Eiffel Tower is located in which city?', a: 'London', b: 'Berlin', c: 'Rome', d: 'Paris', correct: 'D', exp: 'It is a wrought-iron lattice tower on the Champ de Mars in Paris.', diff: 'EASY', marks: 1 },
            ]
          }]
        },
        {
          nameEn: 'Science & Culture',
          sections: [{
            nameEn: 'General',
            questions: [
              { q: 'Who wrote "Hamlet"?', a: 'Charles Dickens', b: 'William Shakespeare', c: 'Mark Twain', d: 'Jane Austen', correct: 'B', exp: 'Shakespeare wrote Hamlet in the early 17th century.', diff: 'EASY', marks: 1 },
              { q: 'Which ocean is the largest?', a: 'Atlantic', b: 'Indian', c: 'Arctic', d: 'Pacific', correct: 'D', exp: 'The Pacific Ocean is the largest and deepest ocean basin.', diff: 'EASY', marks: 1 },
              { q: 'What is the hardest natural substance on Earth?', a: 'Gold', b: 'Iron', c: 'Diamond', d: 'Quartz', correct: 'C', exp: 'Diamond is formed from carbon under extreme pressure and temperature.', diff: 'MEDIUM', marks: 2 },
              { q: 'The Mona Lisa was painted by:', a: 'Vincent van Gogh', b: 'Pablo Picasso', c: 'Leonardo da Vinci', d: 'Michelangelo', correct: 'C', exp: 'It is a half-length portrait painting by the Italian artist Leonardo da Vinci.', diff: 'MEDIUM', marks: 2 },
              { q: 'In which year did the Titanic sink?', a: '1910', b: '1912', c: '1914', d: '1920', correct: 'B', exp: 'The RMS Titanic sank on April 15, 1912.', diff: 'HARD', marks: 3 },
            ]
          }]
        }
      ]
    },
    {
      nameEn: 'Environmental Science',
      icon: '🌱',
      color: '#16a34a',
      chapters: [
        {
          nameEn: 'Pollution',
          sections: [{
            nameEn: 'Types',
            questions: [
              { q: 'Smog is a combination of:', a: 'Smoke and fog', b: 'Snow and fog', c: 'Smoke and dust', d: 'Dust and fog', correct: 'A', exp: 'The term smog was coined from smoke and fog.', diff: 'EASY', marks: 1 },
              { q: 'Which gas is primarily responsible for the greenhouse effect?', a: 'Oxygen', b: 'Nitrogen', c: 'Carbon Dioxide', d: 'Argon', correct: 'C', exp: 'CO2 traps heat in the atmosphere.', diff: 'EASY', marks: 1 },
              { q: 'Ozone layer depletion is mainly caused by:', a: 'CO2', b: 'CFCs (Chlorofluorocarbons)', c: 'Methane', d: 'Sulfur dioxide', correct: 'B', exp: 'CFCs break down ozone molecules in the stratosphere.', diff: 'MEDIUM', marks: 2 },
              { q: 'Acid rain is caused by emissions of:', a: 'Sulfur dioxide and Nitrogen oxides', b: 'Carbon dioxide', c: 'Carbon monoxide', d: 'Methane', correct: 'A', exp: 'These gases react with water to form sulfuric and nitric acids.', diff: 'HARD', marks: 3 },
              { q: 'Eutrophication in lakes is caused by an excess of:', a: 'Oxygen', b: 'Nutrients (Nitrates/Phosphates)', c: 'Heavy metals', d: 'Plastics', correct: 'B', exp: 'Fertilizer runoff causes algal blooms leading to eutrophication.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        },
        {
          nameEn: 'Climate Change',
          sections: [{
            nameEn: 'Effects',
            questions: [
              { q: 'Global warming leads to a rise in sea levels primarily due to:', a: 'More rain', b: 'Melting ice caps and thermal expansion', c: 'More rivers', d: 'Tsunamis', correct: 'B', exp: 'As water warms, it expands, and melting land ice adds more water to oceans.', diff: 'EASY', marks: 1 },
              { q: 'Which of the following is a renewable energy source?', a: 'Coal', b: 'Natural Gas', c: 'Solar Power', d: 'Oil', correct: 'C', exp: 'Solar power relies on the sun and is continually replenished.', diff: 'EASY', marks: 1 },
              { q: 'The Kyoto Protocol aims to:', a: 'Reduce greenhouse gas emissions', b: 'Protect endangered species', c: 'Prevent ocean pollution', d: 'Stop deforestation', correct: 'A', exp: 'It is an international treaty extending the 1992 UN Framework Convention on Climate Change.', diff: 'MEDIUM', marks: 2 },
              { q: 'Permafrost thawing is dangerous because it releases:', a: 'Oxygen', b: 'Methane', c: 'Nitrogen', d: 'Helium', correct: 'B', exp: 'Methane is a potent greenhouse gas trapped in frozen soil.', diff: 'HARD', marks: 3 },
              { q: 'Coral bleaching is caused by:', a: 'Cold water temperatures', b: 'Warm water temperatures', c: 'Too much salt', d: 'Fish eating coral', correct: 'B', exp: 'Heat stress causes corals to expel their symbiotic algae.', diff: 'MEDIUM', marks: 2 },
            ]
          }]
        }
      ]
    }
  ];

  for (let sIdx = 0; sIdx < subjectsData.length; sIdx++) {
    const sData = subjectsData[sIdx];
    const subject = await prisma.subject.create({
      data: {
        nameEn: sData.nameEn,
        icon: sData.icon,
        color: sData.color,
        order: sIdx + 1,
      }
    });

    for (let cIdx = 0; cIdx < sData.chapters.length; cIdx++) {
      const cData = sData.chapters[cIdx];
      const chapter = await prisma.chapter.create({
        data: {
          subjectId: subject.id,
          nameEn: cData.nameEn,
          order: cIdx + 1,
        }
      });

      for (let secIdx = 0; secIdx < cData.sections.length; secIdx++) {
        const secData = cData.sections[secIdx];
        const section = await prisma.section.create({
          data: {
            chapterId: chapter.id,
            nameEn: secData.nameEn,
            order: secIdx + 1,
          }
        });

        const questionsToInsert = secData.questions.map(q => {
          let correctAnswer = AnswerOption.A;
          if (q.correct === 'B') correctAnswer = AnswerOption.B;
          if (q.correct === 'C') correctAnswer = AnswerOption.C;
          if (q.correct === 'D') correctAnswer = AnswerOption.D;

          let difficulty = Difficulty.MEDIUM;
          if (q.diff === 'EASY') difficulty = Difficulty.EASY;
          if (q.diff === 'HARD') difficulty = Difficulty.HARD;

          return {
            sectionId: section.id,
            questionTextEn: q.q,
            optionAEn: q.a,
            optionBEn: q.b,
            optionCEn: q.c,
            optionDEn: q.d,
            correctAnswer,
            explanationEn: q.exp,
            difficulty,
            marks: q.marks,
          };
        });

        await prisma.question.createMany({
          data: questionsToInsert
        });
      }
    }
  }

  console.log('Seed data inserted successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
