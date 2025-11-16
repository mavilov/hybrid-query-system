/**
 *  Static setup unstructured Text Corpus (Vulnerability Advisories and General Guidance)
 *
 * (c) 2025 Maksim Avilov, mavilov@hotmail.com
 */

//TODO: maybe load from external files instead of hardcoding here
export const CORPUS = [
    'A detailed advisory for CVE-2024-001 affecting Node.js packages: The issue is a Cross-Site Scripting (XSS) vulnerability found in version 5.0.0-beta.2, which allows remote attackers to inject arbitrary web script or HTML via specific headers. Users should upgrade to 5.1.0 immediately.',
    'High severity vulnerability in Lodash (Prototype Pollution advisory): Affects versions up to 4.17.20. This allows an attacker to add or modify properties of the Object prototype, potentially leading to denial-of-service or remote code execution. Mitigation requires updating to 4.17.21 or later.',
    'Maven security best practices: Always verify package checksums and use dependency management tools that check against public vulnerability databases. Avoid using SNAPSHOT versions in production environments.',
    'A common vulnerability type is Open Redirect (CWE-601), where a web application allows a user to control a destination URL, potentially tricking them into visiting a malicious site. Patches often involve strict whitelisting of redirect targets.',
    'The current policy for vulnerability response is a 72-hour turnaround time for patch deployment after a CVE is publicly disclosed for critical severity issues.',
    'The Jackson-databind package had multiple deserialization flaws (CVE-2023-9999) impacting version 2.15.0 and earlier. The fix involves blacklisting known gadgets and using secure deserialization configurations.',
    'There is a Medium severity vulnerability in Express.js (CVE-2024-002) that allows for HTTP Parameter Pollution (HPP) attacks. This can lead to unexpected behavior in applications. Users should upgrade to version 4.18.2 or later.',
    'General advice for maintaining secure software dependencies includes regularly auditing your dependency tree, using tools like Snyk or Dependabot, and subscribing to security mailing lists relevant to your tech stack.',
    'Critical vulnerabilities should be prioritized based on their CVSS scores, exploitability, and the presence of active exploits in the wild. A risk-based approach ensures that resources are allocated effectively to mitigate the most pressing threats.',
    "For Python packages, it's essential to avoid using packages with known vulnerabilities listed in the PyPI advisory database. Always check the package's issue tracker and changelog for recent security fixes before integrating it into your project.",
    'Apache Log4j2 2.0-beta9 through 2.15.0 (excluding security releases 2.12.2, 2.12.3, and 2.3.1) JNDI features used in configuration, log messages, and parameters do not protect against attacker controlled LDAP and other JNDI related endpoints. An attacker who can control log messages or log message parameters can execute arbitrary code loaded from LDAP servers when message lookup substitution is enabled. From log4j 2.15.0, this behavior has been disabled by default. From version 2.16.0 (along with 2.12.2, 2.12.3, and 2.3.1), this functionality has been completely removed. Note that this vulnerability is specific to log4j-core and does not affect log4net, log4cxx, or other Apache Logging Services projects.',
]
