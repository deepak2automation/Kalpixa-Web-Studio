/**
 * Shared field-level validation for Kalpixa forms.
 * Every function returns an error string on failure, or null on success.
 */

// --- Email ---

const EMAIL_FORMAT = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

const DISPOSABLE_DOMAINS = new Set([
  "test.com", "test.test", "example.com", "example.test",
  "test.org", "test.net", "fake.com", "fake.com",
  "dummy.com", "dummy.org", "dummy.com",
  "temp.com", "tempmail.com", "temp-mail.com",
  "throwaway.com", "throwaway.email",
  "mailinator.com", "guerrillamail.com", "guerrillamail.net",
  "yopmail.com", "yopmail.fr", "yopmail.net",
  "trashmail.com", "trashmail.net", "trash-mail.com",
  "dispostable.com", "sharklasers.com", "guerrillamail.info",
  "grr.la", "getnada.com", "maildrop.cc", "mailnesia.com",
  "10minutemail.com", "10minutemail.net",
  "mohmal.com", "mohmal.tech",
  "fakeinbox.com", "spam4.me", "spambog.com", "spam.la",
  "mailcatch.com", "inboxalias.com", "inboxbear.com",
  "trashymail.com", "mytemp.email", "tempr.email",
  "abc.com", "abc.org", "abc.net", "xyz.com", "xyz.org",
  "aaa.com", "aaa.org", "aaa.net",
  "111.com", "123.com", "123.net", "qq.qq",
  "asdf.com", "asdf.asdf", "asdfgh.com",
  "qwer.com", "qwerty.com", "qwerty.asdf",
  "no.com", "no.no", "no.org",
  "foo.com", "foo.bar", "bar.com", "bar.bar",
  "email.com", "mail.com", "mail.mail",
  "none.com", "none.none", "nothing.com",
  "void.com", "void.com",
  "a.com", "a.a",
  "xx.com", "xx.xx", "xxx.com", "xxx.xxx",
  "test.test.com", "test.test.org",
  "domain.com", "domain.com",
  "yourdomain.com", "yourdomain.com",
  "yourdomain.com", "yours.com",
  "sample.com", "sample.org", "sample.net",
  "placeholder.com", "placeholder.com",
]);

const ROLE_PREFIXES = new Set([
  "test", "testing", "tester", "demo", "demo1", "demo2",
  "fake", "fake1", "fake2",
  "dummy", "dummy1", "dummy2",
  "temp", "temp1", "temp2",
  "example", "example1", "example2",
  "sample", "sample1", "sample2",
  "user", "user1", "user2", "user3",
  "admin", "root", "info", "contact",
  "aaa", "a", "aa", "ab",
  "asdf", "asdfg", "asdfgh",
  "qwerty", "qwer", "qwe",
  "123", "1234", "12345",
  "xyz", "xyz123", "abc", "abc123",
  "foo", "bar", "foobar",
  "no", "none", "null", "undefined",
]);

export function validateEmail(value: string): string | null {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) return "Email address is required.";

  if (trimmed.length > 254) return "Email address is too long.";

  if (!EMAIL_FORMAT.test(trimmed))
    return "Please enter a valid email address.";

  const [localPart, domain] = trimmed.split("@");
  if (!localPart || !domain) return "Please enter a valid email address.";

  if (localPart.length > 64) return "Email local part is too long.";

  if (localPart.startsWith(".") || localPart.endsWith("."))
    return "Email cannot start or end with a dot.";

  if (localPart.includes(".."))
    return "Email cannot have consecutive dots.";

  if (domain.startsWith(".") || domain.endsWith("."))
    return "Email domain cannot start or end with a dot.";

  if (domain.includes(".."))
    return "Email domain cannot have consecutive dots.";

  if (domain.indexOf(".") === -1)
    return "Email domain must include a valid extension (e.g. .com).";

  if (DISPOSABLE_DOMAINS.has(domain))
    return "Please use a real email address — disposable domains are not accepted.";

  if (domain.endsWith(".test") || domain.endsWith(".example") || domain.endsWith(".localhost"))
    return "Please use a real email address — test domains are not accepted.";

  if (localPart.length <= 2 && ROLE_PREFIXES.has(localPart) && DISPOSABLE_DOMAINS.has(domain))
    return "Please use a real email address, not a placeholder.";

  const domainParts = domain.split(".");
  const sld = domainParts[0];
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2)
    return "Email domain extension must be at least 2 characters.";

  if (/^\d+$/.test(tld))
    return "Email domain extension cannot be numeric.";

  if (localPart === domain || localPart === sld)
    return "Please use a real email address — local part cannot match the domain.";

  if (/^(\d)\1+$/.test(localPart))
    return "Please use a real email address — repetitive characters are not valid.";

  if (/^(.)\1{4,}$/.test(localPart))
    return "Please use a real email address — repetitive characters are not valid.";

  return null;
}

// --- Name ---

const NAME_FORMAT = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]+$/;

export function validateName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return "Your name is required.";

  if (trimmed.length < 2) return "Name must be at least 2 characters.";
  if (trimmed.length > 60) return "Name must be at most 60 characters.";

  if (!NAME_FORMAT.test(trimmed))
    return "Name can only contain letters, spaces, apostrophes, hyphens, and periods.";

  if (/^[.'\-\s]+$/.test(trimmed))
    return "Name must contain at least one letter.";

  if (/^(.)\1+$/.test(trimmed.replace(/[\s'.\-]/g, "")))
    return "Please enter a real name — repetitive characters are not valid.";

  return null;
}

// --- Phone ---

export function validatePhone(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return null;

  if (!/^[\d\s\-()+]+$/.test(trimmed))
    return "Phone number can only contain digits, spaces, hyphens, and +().";

  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount < 7) return "Phone number must have at least 7 digits.";
  if (digitCount > 15) return "Phone number cannot exceed 15 digits.";

  if (trimmed.startsWith("+")) {
    const codeMatch = trimmed.match(/^\+(\d{1,4})/);
    if (!codeMatch) {
      return "Country code must be +1 to +4 digits.";
    }
    const codeNum = parseInt(codeMatch[1], 10);
    if (codeNum < 1 || codeNum > 899) {
      return "Please enter a valid country code.";
    }
  }

  return null;
}

// --- Message ---

export function validateMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Please tell us a bit about your project.";

  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 5) return "Please write at least 5 words about your project.";
  if (words.length > 1000) return "Maximum 1000 words allowed.";

  if (/^(.)\1{19,}$/.test(trimmed))
    return "Please enter a meaningful project description.";

  return null;
}

// --- URL (for SEO Analyzer) ---

const URL_FORMAT = /^(https?:\/\/)?([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}([\/?#].*)?$/i;

export function validateUrl(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) return "Please enter a website URL to analyze.";

  if (trimmed.length > 2048) return "URL is too long.";

  if (trimmed.includes(" ")) return "URL cannot contain spaces.";

  if (!URL_FORMAT.test(trimmed))
    return "Please enter a valid website URL (e.g. example.com).";

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(normalized);
    if (u.hostname.includes("..")) return "URL hostname is invalid.";
    if (/^\d+$/.test(u.hostname)) return "Please enter a domain name, not an IP address.";

    const tld = u.hostname.split(".").pop() || "";
    if (tld.length < 2) return "URL must have a valid domain extension.";
  } catch {
    return "Please enter a valid website URL.";
  }

  return null;
}
