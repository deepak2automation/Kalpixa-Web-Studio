import {
  validateEmail,
  validateName,
  validatePhone,
  validateMessage,
  validateUrl,
} from "../validation";

type TestCase = {
  input: string;
  shouldPass: boolean;
  description: string;
};

const emailCases: TestCase[] = [
  // VALID emails
  { input: "deepak@kalpixa.com", shouldPass: true, description: "Business email" },
  { input: "john.doe@gmail.com", shouldPass: true, description: "Gmail with dot" },
  { input: "user+tag@outlook.com", shouldPass: true, description: "Plus addressing" },
  { input: "contact@mybusiness.com", shouldPass: true, description: "Custom domain" },
  { input: "info@smallbusiness.in", shouldPass: true, description: "Indian business" },
  { input: "user_name@company.org", shouldPass: true, description: "Underscore local" },
  { input: "a@b.co", shouldPass: true, description: "Short but valid" },

  // INVALID: disposable/fake domains
  { input: "test@test.com", shouldPass: false, description: "test@test.com - the original bug" },
  { input: "user@example.com", shouldPass: false, description: "Example domain" },
  { input: "test@mailinator.com", shouldPass: false, description: "Mailinator disposable" },
  { input: "a@yopmail.com", shouldPass: false, description: "Yopmail disposable" },
  { input: "x@10minutemail.com", shouldPass: false, description: "10 minute mail" },
  { input: "x@guerrillamail.com", shouldPass: false, description: "Guerrilla mail" },
  { input: "x@tempmail.com", shouldPass: false, description: "Tempmail disposable" },
  { input: "x@trashmail.com", shouldPass: false, description: "Trashmail disposable" },
  { input: "x@fake.com", shouldPass: false, description: "Fake domain" },
  { input: "x@dummy.com", shouldPass: false, description: "Dummy domain" },
  { input: "x@abc.com", shouldPass: false, description: "ABC placeholder" },
  { input: "x@xyz.com", shouldPass: false, description: "XYZ placeholder" },
  { input: "x@foo.com", shouldPass: false, description: "Foo placeholder" },
  { input: "x@bar.com", shouldPass: false, description: "Bar placeholder" },

  // INVALID: structural
  { input: "", shouldPass: false, description: "Empty" },
  { input: "plaintext", shouldPass: false, description: "No @ symbol" },
  { input: "@domain.com", shouldPass: false, description: "No local part" },
  { input: "user@", shouldPass: false, description: "No domain" },
  { input: "user@domain", shouldPass: false, description: "No TLD" },
  { input: "user@.com", shouldPass: false, description: "Domain starts with dot" },
  { input: "user@domain..com", shouldPass: false, description: "Consecutive dots in domain" },
  { input: ".user@domain.com", shouldPass: false, description: "Local starts with dot" },
  { input: "user.@domain.com", shouldPass: false, description: "Local ends with dot" },
  { input: "user..name@domain.com", shouldPass: false, description: "Consecutive dots in local" },
  { input: "user@domain.c", shouldPass: false, description: "TLD too short (1 char)" },
  { input: "user@domain.123", shouldPass: false, description: "Numeric TLD" },
  { input: "user@domain.test", shouldPass: false, description: ".test TLD" },
  { input: "user@domain.example", shouldPass: false, description: ".example TLD" },
  { input: "user@domain.localhost", shouldPass: false, description: ".localhost TLD" },
  { input: "a".repeat(65) + "@gmail.com", shouldPass: false, description: "Local part > 64 chars" },
  { input: "user@name.com", shouldPass: true, description: "Valid email (user != name)" },
];

const nameCases: TestCase[] = [
  // VALID
  { input: "Deepak Sharma", shouldPass: true, description: "Full name" },
  { input: "John O'Brien", shouldPass: true, description: "Apostrophe" },
  { input: "Mary-Jane Watson", shouldPass: true, description: "Hyphenated" },
  { input: "Dr. Smith", shouldPass: true, description: "Period prefix" },
  { input: "Élise Müller", shouldPass: true, description: "Accented chars" },
  { input: "Li", shouldPass: true, description: "Short valid name" },

  // INVALID
  { input: "", shouldPass: false, description: "Empty" },
  { input: "A", shouldPass: false, description: "Single char" },
  { input: "12345", shouldPass: false, description: "Numbers only" },
  { input: "John123", shouldPass: false, description: "Letters and numbers" },
  { input: "AAAAAA", shouldPass: false, description: "Repetitive characters" },
  { input: "---", shouldPass: false, description: "Punctuation only" },
  { input: "a".repeat(61), shouldPass: false, description: "Too long (>60)" },
];

const phoneCases: TestCase[] = [
  // VALID
  { input: "", shouldPass: true, description: "Empty (optional field)" },
  { input: "+91 79000 71164", shouldPass: true, description: "Indian format" },
  { input: "+1 (555) 123-4567", shouldPass: true, description: "US format" },
  { input: "7900071164", shouldPass: true, description: "10 digits no formatting" },
  { input: "+44 20 7946 0958", shouldPass: true, description: "UK format" },

  // INVALID
  { input: "123", shouldPass: false, description: "Too few digits" },
  { input: "abc", shouldPass: false, description: "Letters" },
  { input: "+999 1234567890", shouldPass: false, description: "Invalid country code" },
  { input: "1".repeat(16), shouldPass: false, description: "Too many digits" },
];

const messageCases: TestCase[] = [
  // VALID
  { input: "I need a new website for my restaurant with online ordering.", shouldPass: true, description: "Real project description" },
  { input: "We want to improve our SEO ranking for local search results.", shouldPass: true, description: "SEO request" },

  // INVALID
  { input: "", shouldPass: false, description: "Empty" },
  { input: "Hi", shouldPass: false, description: "Too short (<5 words)" },
  { input: "a".repeat(5000), shouldPass: false, description: "Too long (>1000 words)" },
  { input: "a".repeat(50), shouldPass: false, description: "Repetitive characters" },
];

const urlCases: TestCase[] = [
  // VALID
  { input: "kalpixa.com", shouldPass: true, description: "Domain only" },
  { input: "https://kalpixa.com", shouldPass: true, description: "With protocol" },
  { input: "https://www.google.com/search?q=seo", shouldPass: true, description: "Full URL with query" },
  { input: "example.org/path/to/page", shouldPass: true, description: "Path segments" },
  { input: "sub.domain.co.uk", shouldPass: true, description: "Subdomain + co.uk" },

  // INVALID
  { input: "", shouldPass: false, description: "Empty" },
  { input: "not a url", shouldPass: false, description: "Contains spaces" },
  { input: "test", shouldPass: false, description: "No domain" },
  { input: "localhost", shouldPass: false, description: "No TLD" },
  { input: "192.168.1.1", shouldPass: false, description: "IP address" },
  { input: "example.c", shouldPass: false, description: "TLD too short" },
  { input: "http://" + "a".repeat(3000) + ".com", shouldPass: false, description: "Too long" },
];

function runSuite(name: string, cases: TestCase[], validator: (v: string) => string | null) {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const tc of cases) {
    const result = validator(tc.input);
    const actualPass = result === null;

    if (actualPass === tc.shouldPass) {
      passed++;
    } else {
      failed++;
      const expected = tc.shouldPass ? "PASS" : "FAIL";
      const actual = actualPass ? "PASS" : `FAIL (${result})`;
      failures.push(`  [${tc.description}] expected ${expected}, got ${actual} | input: "${tc.input}"`);
    }
  }

  console.log(`\n=== ${name} ===`);
  console.log(`  ${passed} passed, ${failed} failed, ${cases.length} total`);
  if (failures.length > 0) {
    console.log("  FAILURES:");
    failures.forEach((f) => console.log(f));
  }
  return failed;
}

let totalFailed = 0;
totalFailed += runSuite("Email Validation", emailCases, validateEmail);
totalFailed += runSuite("Name Validation", nameCases, validateName);
totalFailed += runSuite("Phone Validation", phoneCases, validatePhone);
totalFailed += runSuite("Message Validation", messageCases, validateMessage);
totalFailed += runSuite("URL Validation", urlCases, validateUrl);

console.log(`\n${"=".repeat(50)}`);
if (totalFailed === 0) {
  console.log("ALL TESTS PASSED");
} else {
  console.log(`${totalFailed} TEST FAILURES - see above`);
}
process.exit(totalFailed === 0 ? 0 : 1);
