/**
 *  Static setup structured Data (Packages and Vulnerabilities)
 *  Updated by crawler at 2026-01-25T19:31:46.088Z
 */

export const SQL_SCHEMA = `
-- Table of known software packages
CREATE TABLE IF NOT EXISTS packages (
    package_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    repository TEXT TEXT CHECK( repository IN ('npm','maven','pypi', 'rpm', 'cisa') ) NOT NULL
);

-- Table of specific vulnerability records
CREATE TABLE IF NOT EXISTS vulnerabilities (
    vuln_id INTEGER PRIMARY KEY,
    package_id INTEGER,
    version_start TEXT, -- Version where vulnerability begins (inclusive)
    version_end TEXT,   -- Version where vulnerability ends (inclusive)
    severity TEXT CHECK( severity IN ('CRITICAL','HIGH','MEDIUM','LOW') ),
    cve_id TEXT,        -- Unique vulnerability identifier
    summary TEXT,       -- Short description
    FOREIGN KEY (package_id) REFERENCES packages(package_id)
);
`;

export const SQL_DATA = [
    {
        table: 'packages',
        data: [
        [
                1,
                "express",
                "npm"
        ],
        [
                2,
                "lodash",
                "npm"
        ],
        [
                3,
                "jackson-databind",
                "maven"
        ],
        [
                4,
                "log4j",
                "maven"
        ],
        [
                5,
                "axios",
                "npm"
        ],
        [
                6,
                "validator-node",
                "npm"
        ],
        [
                1000,
                "Broadcom VMware vCenter Server",
                "cisa"
        ],
        [
                1001,
                "Synacor  Zimbra Collaboration Suite (ZCS)",
                "cisa"
        ],
        [
                1002,
                "Versa Concerto",
                "cisa"
        ],
        [
                1003,
                "Vite Vitejs",
                "cisa"
        ],
        [
                1004,
                "Prettier eslint-config-prettier",
                "cisa"
        ],
        [
                1005,
                "Cisco Unified Communications Manager",
                "cisa"
        ],
        [
                1006,
                "Microsoft Windows",
                "cisa"
        ],
        [
                1007,
                "Gogs Gogs",
                "cisa"
        ],
        [
                1008,
                "Microsoft Office",
                "cisa"
        ],
        [
                1009,
                "Hewlett Packard Enterprise (HPE) OneView",
                "cisa"
        ],
        [
                1010,
                "MongoDB MongoDB and MongoDB Server",
                "cisa"
        ],
        [
                1011,
                "Digiever DS-2105 Pro",
                "cisa"
        ],
        [
                1012,
                "WatchGuard Firebox",
                "cisa"
        ],
        [
                1013,
                "ASUS Live Update",
                "cisa"
        ],
        [
                1014,
                "SonicWall SMA1000 appliance",
                "cisa"
        ],
        [
                1015,
                "Cisco Multiple Products",
                "cisa"
        ],
        [
                1016,
                "Fortinet Multiple Products",
                "cisa"
        ],
        [
                1017,
                "Gladinet CentreStack and Triofox",
                "cisa"
        ],
        [
                1018,
                "Apple Multiple Products",
                "cisa"
        ],
        [
                1019,
                "Sierra Wireless AirLink ALEOS",
                "cisa"
        ],
        [
                1020,
                "Google Chromium",
                "cisa"
        ],
        [
                1021,
                "OSGeo GeoServer",
                "cisa"
        ],
        [
                1022,
                "RARLAB WinRAR",
                "cisa"
        ],
        [
                1023,
                "D-Link Routers",
                "cisa"
        ],
        [
                1024,
                "Array Networks  ArrayOS AG",
                "cisa"
        ],
        [
                1025,
                "Meta React Server Components",
                "cisa"
        ],
        [
                1026,
                "OpenPLC ScadaBR",
                "cisa"
        ],
        [
                1027,
                "Android Framework",
                "cisa"
        ],
        [
                1028,
                "Oracle Fusion Middleware",
                "cisa"
        ],
        [
                1029,
                "Google Chromium V8",
                "cisa"
        ],
        [
                1030,
                "Fortinet FortiWeb",
                "cisa"
        ],
        [
                1031,
                "Gladinet Triofox",
                "cisa"
        ],
        [
                1032,
                "Samsung Mobile Devices",
                "cisa"
        ],
        [
                1033,
                "CWP Control Web Panel",
                "cisa"
        ],
        [
                1034,
                "Broadcom VMware Aria Operations and VMware Tools",
                "cisa"
        ],
        [
                1035,
                "XWiki Platform",
                "cisa"
        ],
        [
                1036,
                "Dassault Systèmes DELMIA Apriso",
                "cisa"
        ],
        [
                1037,
                "Adobe Commerce and Magento",
                "cisa"
        ],
        [
                1038,
                "Motex LANSCOPE Endpoint Manager",
                "cisa"
        ],
        [
                1039,
                "Kentico Xperience CMS",
                "cisa"
        ],
        [
                1040,
                "Oracle E-Business Suite",
                "cisa"
        ],
        [
                1041,
                "Adobe Experience Manager (AEM) Forms",
                "cisa"
        ],
        [
                1042,
                "IGEL IGEL OS",
                "cisa"
        ],
        [
                1043,
                "SKYSEA Client View",
                "cisa"
        ],
        [
                1044,
                "Grafana Labs Grafana",
                "cisa"
        ],
        [
                1045,
                "Synacor Zimbra Collaboration Suite (ZCS)",
                "cisa"
        ],
        [
                1046,
                "Linux Kernel",
                "cisa"
        ],
        [
                1047,
                "Microsoft Internet Explorer",
                "cisa"
        ],
        [
                1048,
                "Mozilla Multiple Products",
                "cisa"
        ],
        [
                1049,
                "GNU GNU Bash",
                "cisa"
        ],
        [
                1050,
                "Jenkins Jenkins",
                "cisa"
        ],
        [
                1051,
                "Juniper ScreenOS",
                "cisa"
        ],
        [
                1052,
                "Smartbedded Meteobridge",
                "cisa"
        ],
        [
                1053,
                "Sudo Sudo",
                "cisa"
        ],
        [
                1054,
                "Libraesva Email Security Gateway",
                "cisa"
        ],
        [
                1055,
                "Fortra GoAnywhere MFT",
                "cisa"
        ],
        [
                1056,
                "Cisco IOS and IOS XE",
                "cisa"
        ],
        [
                1057,
                "Adminer Adminer",
                "cisa"
        ],
        [
                1058,
                "Cisco Secure Firewall Adaptive Security Appliance and Secure Firewall Threat Defense",
                "cisa"
        ],
        [
                1059,
                "Android Runtime",
                "cisa"
        ],
        [
                1060,
                "Sitecore Multiple Products",
                "cisa"
        ],
        [
                1061,
                "TP-Link TL-WR841N",
                "cisa"
        ],
        [
                1062,
                "TP-Link Multiple Routers",
                "cisa"
        ],
        [
                1063,
                "TP-Link TL-WA855RE",
                "cisa"
        ],
        [
                1064,
                "Meta Platforms WhatsApp",
                "cisa"
        ],
        [
                1065,
                "Sangoma FreePBX",
                "cisa"
        ],
        [
                1066,
                "Citrix NetScaler",
                "cisa"
        ],
        [
                1067,
                "Git Git",
                "cisa"
        ],
        [
                1068,
                "Citrix Session Recording",
                "cisa"
        ],
        [
                1069,
                "Apple iOS, iPadOS, and macOS",
                "cisa"
        ],
        [
                1070,
                "Trend Micro Apex One",
                "cisa"
        ],
        [
                1071,
                "N-able N-Central",
                "cisa"
        ]
]
    },
    {
        table: 'vulnerabilities',
        data: [
        [
                101,
                1,
                "5.0.0-beta.2",
                "5.0.0-beta.2",
                "MEDIUM",
                "CVE-2024-001",
                "Cross-site Scripting/Open Redirect"
        ],
        [
                102,
                2,
                "4.17.0",
                "4.17.20",
                "HIGH",
                "CVE-2023-1001",
                "Prototype Pollution"
        ],
        [
                103,
                3,
                "2.0.0",
                "2.15.0",
                "CRITICAL",
                "CVE-2023-9999",
                "Deserialization Flaw"
        ],
        [
                104,
                4,
                "2.0-beta9",
                "2.15.0",
                "CRITICAL",
                "CVE-2021-44228",
                "Zero-day vulnerability allowing remote code execution"
        ],
        [
                105,
                5,
                "0.21.0",
                "0.21.1",
                "HIGH",
                "CVE-2023-2001",
                "Server-Side Request Forgery"
        ],
        [
                106,
                5,
                "0.18.0",
                "0.21.0",
                "MEDIUM",
                "CVE-2022-3001",
                "Denial of Service"
        ],
        [
                107,
                5,
                "0.19.0",
                "0.19.2",
                "LOW",
                "CVE-2021-1234",
                "Information Exposure"
        ],
        [
                108,
                5,
                "1.11.0",
                "1.11.2",
                "HIGH",
                "CVE-2024-3002",
                "Allocation of Resources Without Limits or Throttling"
        ],
        [
                110,
                6,
                null,
                null,
                "CRITICAL",
                "SNYK-JS-VALIDATORNODE-13961690",
                "Malicious Package"
        ],
        [
                10000,
                1000,
                null,
                null,
                "HIGH",
                "CVE-2024-37079",
                "Broadcom VMware vCenter Server contains an out-of-bounds write vulnerability in the implementation of the DCERPC protocol. This could allow a malicious actor with network access to vCenter Server to send specially crafted network packets, potentially leading to remote code execution."
        ],
        [
                10001,
                1001,
                null,
                null,
                "HIGH",
                "CVE-2025-68645",
                "Synacor Zimbra Collaboration Suite (ZCS) contains a PHP remote file inclusion vulnerability that could allow for remote attackers to craft requests to the /h/rest endpoint to influence internal request dispatching, allowing inclusion of arbitrary files from the WebRoot directory."
        ],
        [
                10002,
                1002,
                null,
                null,
                "HIGH",
                "CVE-2025-34026",
                "Versa Concerto SD-WAN orchestration platform contains an improper authentication vulnerability in the Traefik reverse proxy configuration, allowing at attacker to access administrative endpoints. The internal Actuator endpoint can be leveraged for access to heap dumps and trace logs."
        ],
        [
                10003,
                1003,
                null,
                null,
                "HIGH",
                "CVE-2025-31125",
                "Vite Vitejs contains an improper access control vulnerability that exposes content of non-allowed files using ?inline&import or ?raw?import. Only apps explicitly exposing the Vite dev server to the network (using --host or server.host config option) are affected."
        ],
        [
                10004,
                1004,
                null,
                null,
                "HIGH",
                "CVE-2025-54313",
                "Prettier eslint-config-prettier contains an embedded malicious code vulnerability. Installing an affected package executes an install.js file that launches the node-gyp.dll malware on Windows."
        ],
        [
                10005,
                1005,
                null,
                null,
                "HIGH",
                "CVE-2026-20045",
                "Cisco Unified Communications Manager (Unified CM), Cisco Unified Communications Manager Session Management Edition (Unified CM SME), Cisco Unified Communications Manager IM & Presence Service (Unified CM IM&P), Cisco Unity Connection, and Cisco Webex Calling Dedicated Instance contain a code injection vulnerability that could allow the attacker to obtain user-level access to the underlying operating system and then elevate privileges to root."
        ],
        [
                10006,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2026-20805",
                "Microsoft Windows Desktop Windows Manager contains an information disclosure vulnerability that allows an authorized attacker to disclose information locally."
        ],
        [
                10007,
                1007,
                null,
                null,
                "HIGH",
                "CVE-2025-8110",
                "Gogs contains a path traversal vulnerability affecting improper Symbolic link handling in the PutContents API that could allow for code execution."
        ],
        [
                10008,
                1008,
                null,
                null,
                "HIGH",
                "CVE-2009-0556",
                "Microsoft Office PowerPoint contains a code injection vulnerability that allows remote attackers to execute arbitrary code via a PowerPoint file with an OutlineTextRefAtom containing an invalid index value that triggers memory corruption."
        ],
        [
                10009,
                1009,
                null,
                null,
                "HIGH",
                "CVE-2025-37164",
                "Hewlett Packard Enterprise (HPE) OneView contains a code injection vulnerability that allows a remote unauthenticated user to perform remote code execution."
        ],
        [
                10010,
                1010,
                null,
                null,
                "HIGH",
                "CVE-2025-14847",
                "MongoDB Server contains an improper handling of length parameter inconsistency vulnerability in Zlib compressed protocol headers. This vulnerability may allow a read of uninitialized heap memory by an unauthenticated client."
        ],
        [
                10011,
                1011,
                null,
                null,
                "HIGH",
                "CVE-2023-52163",
                "Digiever DS-2105 Pro contains a missing authorization vulnerability which could allow for command injection via time_tzsetup.cgi."
        ],
        [
                10012,
                1012,
                null,
                null,
                "HIGH",
                "CVE-2025-14733",
                "WatchGuard Fireware OS iked process contains an out of bounds write vulnerability in the OS iked process. This vulnerability may allow a remote unauthenticated attacker to execute arbitrary code and affects both the mobile user VPN with IKEv2 and the branch office VPN using IKEv2 when configured with a dynamic gateway peer."
        ],
        [
                10013,
                1013,
                null,
                null,
                "HIGH",
                "CVE-2025-59374",
                "ASUS Live Update contains an embedded malicious code vulnerability client were distributed with unauthorized modifications introduced through a supply chain compromise. The modified builds could cause devices meeting specific targeting conditions to perform unintended actions. The impacted product could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10014,
                1014,
                null,
                null,
                "HIGH",
                "CVE-2025-40602",
                "SonicWall SMA1000 contains a missing authorization vulnerability that could allow for privilege escalation appliance management console (AMC) of affected devices."
        ],
        [
                10015,
                1015,
                null,
                null,
                "HIGH",
                "CVE-2025-20393",
                "Cisco Secure Email Gateway, Secure Email, AsyncOS Software, and Web Manager appliances contains an improper input validation vulnerability that allows threat actors to execute arbitrary commands with root privileges on the underlying operating system of an affected appliance."
        ],
        [
                10016,
                1016,
                null,
                null,
                "HIGH",
                "CVE-2025-59718",
                "Fortinet FortiOS, FortiSwitchMaster, FortiProxy, and FortiWeb contain an improper verification of cryptographic signature vulnerability that may allow an unauthenticated attacker to bypass the FortiCloud SSO login authentication via a crafted SAML message. Please be aware that CVE-2025-59719 pertains to the same problem and is mentioned in the same vendor advisory. Ensure to apply all patches mentioned in the advisory."
        ],
        [
                10017,
                1017,
                null,
                null,
                "HIGH",
                "CVE-2025-14611",
                "Gladinet CentreStack and TrioFox contain a hardcoded cryptographic keys vulnerability for their implementation of the AES cryptoscheme. This vulnerability degrades security for public exposed endpoints that may make use of it and may offer arbitrary local file inclusion when provided a specially crafted request without authentication."
        ],
        [
                10018,
                1018,
                null,
                null,
                "HIGH",
                "CVE-2025-43529",
                "Apple iOS, iPadOS, macOS, and other Apple products contain a use-after-free vulnerability in WebKit. Processing maliciously crafted web content may lead to memory corruption. This vulnerability could impact HTML parsers that use WebKit, including but not limited to Apple Safari and non-Apple products which rely on WebKit for HTML processing."
        ],
        [
                10019,
                1019,
                null,
                null,
                "HIGH",
                "CVE-2018-4063",
                "Sierra Wireless AirLink ALEOS contains an unrestricted upload of file with dangerous type vulnerability. A specially crafted HTTP request can upload a file, resulting in executable code being uploaded, and routable, to the webserver. An attacker can make an authenticated HTTP request to trigger this vulnerability. The impacted product could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10020,
                1020,
                null,
                null,
                "HIGH",
                "CVE-2025-14174",
                "Google Chromium contains an out of bounds memory access vulnerability in ANGLE that could allow a remote attacker to perform out of bounds memory access via a crafted HTML page. This vulnerability could affect multiple web browsers that utilize Chromium, including, but not limited to, Google Chrome, Microsoft Edge, and Opera."
        ],
        [
                10021,
                1021,
                null,
                null,
                "HIGH",
                "CVE-2025-58360",
                "OSGeo GeoServer contains an improper restriction of XML external entity reference vulnerability that occurs when the application accepts XML input through a specific endpoint /geoserver/wms operation GetMap and could allow an attacker to define external entities within the XML request."
        ],
        [
                10022,
                1022,
                null,
                null,
                "HIGH",
                "CVE-2025-6218",
                "RARLAB WinRAR contains a path traversal vulnerability allowing an attacker to execute code in the context of the current user."
        ],
        [
                10023,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-62221",
                "Microsoft Windows Cloud Files Mini Filter Driver contains a use after free vulnerability that can allow an authorized attacker to elevate privileges locally."
        ],
        [
                10024,
                1023,
                null,
                null,
                "HIGH",
                "CVE-2022-37055",
                "D-Link Routers contains a buffer overflow vulnerability that has a high impact on confidentiality, integrity, and availability. The impacted products could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10025,
                1024,
                null,
                null,
                "HIGH",
                "CVE-2025-66644",
                "Array Networks ArrayOS AG contains an OS command injection vulnerability that could allow an attacker to execute arbitrary commands."
        ],
        [
                10026,
                1025,
                null,
                null,
                "HIGH",
                "CVE-2025-55182",
                "Meta React Server Components contains a remote code execution vulnerability that could allow unauthenticated remote code execution by exploiting a flaw in how React decodes payloads sent to React Server Function endpoints. Please note CVE-2025-66478 has been rejected, but it is associated with CVE-2025- 55182."
        ],
        [
                10027,
                1026,
                null,
                null,
                "HIGH",
                "CVE-2021-26828",
                "OpenPLC ScadaBR contains an unrestricted upload of file with dangerous type vulnerability that allows remote authenticated users to upload and execute arbitrary JSP files via view_edit.shtm."
        ],
        [
                10028,
                1027,
                null,
                null,
                "HIGH",
                "CVE-2025-48633",
                "Android Framework contains an unspecified vulnerability that allows for information disclosure."
        ],
        [
                10029,
                1027,
                null,
                null,
                "HIGH",
                "CVE-2025-48572",
                "Android Framework contains an unspecified vulnerability that allows for privilege escalation."
        ],
        [
                10030,
                1026,
                null,
                null,
                "HIGH",
                "CVE-2021-26829",
                "OpenPLC ScadaBR contains a cross-site scripting vulnerability via system_settings.shtm."
        ],
        [
                10031,
                1028,
                null,
                null,
                "HIGH",
                "CVE-2025-61757",
                "Oracle Fusion Middleware contains a missing authentication for critical function vulnerability, allowing unauthenticated remote attackers to take over Identity Manager."
        ],
        [
                10032,
                1029,
                null,
                null,
                "HIGH",
                "CVE-2025-13223",
                "Google Chromium V8 contains a type confusion vulnerability that allows for heap corruption."
        ],
        [
                10033,
                1030,
                null,
                null,
                "HIGH",
                "CVE-2025-58034",
                "Fortinet FortiWeb contains an OS command Injection vulnerability that may allow an authenticated attacker to execute unauthorized code on the underlying system via crafted HTTP requests or CLI commands."
        ],
        [
                10034,
                1030,
                null,
                null,
                "HIGH",
                "CVE-2025-64446",
                "Fortinet FortiWeb contains a relative path traversal vulnerability that may allow an unauthenticated attacker to execute administrative commands on the system via crafted HTTP or HTTPS requests."
        ],
        [
                10035,
                1031,
                null,
                null,
                "HIGH",
                "CVE-2025-12480",
                "Gladinet Triofox contains an improper access control vulnerability that allows access to initial setup pages even after setup is complete."
        ],
        [
                10036,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-62215",
                "Microsoft Windows Kernel contains a race condition vulnerability that allows a local attacker with low-level privileges to escalate privileges. Successful exploitation of this vulnerability could enable the attacker to gain SYSTEM-level access."
        ],
        [
                10037,
                1012,
                null,
                null,
                "HIGH",
                "CVE-2025-9242",
                "WatchGuard Firebox contains an out-of-bounds write vulnerability in the OS iked process that may allow a remote unauthenticated attacker to execute arbitrary code."
        ],
        [
                10038,
                1032,
                null,
                null,
                "HIGH",
                "CVE-2025-21042",
                "Samsung mobile devices contain an out-of-bounds write vulnerability in libimagecodec.quram.so. This vulnerability could allow remote attackers to execute arbitrary code."
        ],
        [
                10039,
                1033,
                null,
                null,
                "HIGH",
                "CVE-2025-48703",
                "CWP Control Web Panel (formerly CentOS Web Panel) contains an OS command Injection vulnerability that allows unauthenticated remote code execution via shell metacharacters in the t_total parameter in a filemanager changePerm request. A valid non-root username must be known."
        ],
        [
                10040,
                1017,
                null,
                null,
                "HIGH",
                "CVE-2025-11371",
                "Gladinet CentreStack and Triofox contains a files or directories accessible to external parties vulnerability that allows unintended disclosure of system files."
        ],
        [
                10041,
                1034,
                null,
                null,
                "HIGH",
                "CVE-2025-41244",
                "Broadcom VMware Aria Operations and VMware Tools contain a privilege defined with unsafe actions vulnerability. A malicious local actor with non-administrative privileges having access to a VM with VMware Tools installed and managed by Aria Operations with SDMP enabled may exploit this vulnerability to escalate privileges to root on the same VM."
        ],
        [
                10042,
                1035,
                null,
                null,
                "HIGH",
                "CVE-2025-24893",
                "XWiki Platform contains an eval injection vulnerability that could allow any guest to perform arbitrary remote code execution through a request to SolrSearch."
        ],
        [
                10043,
                1036,
                null,
                null,
                "HIGH",
                "CVE-2025-6204",
                "Dassault Systèmes DELMIA Apriso contains a code injection vulnerability that could allow an attacker to execute arbitrary code."
        ],
        [
                10044,
                1036,
                null,
                null,
                "HIGH",
                "CVE-2025-6205",
                "Dassault Systèmes DELMIA Apriso contains a missing authorization vulnerability that could allow an attacker to gain privileged access to the application."
        ],
        [
                10045,
                1037,
                null,
                null,
                "HIGH",
                "CVE-2025-54236",
                "Adobe Commerce and Magento Open Source contain an improper input validation vulnerability that could allow an attacker to take over customer accounts through the Commerce REST API."
        ],
        [
                10046,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-59287",
                "Microsoft Windows Server Update Service (WSUS) contains a deserialization of untrusted data vulnerability that allows for remote code execution."
        ],
        [
                10047,
                1038,
                null,
                null,
                "HIGH",
                "CVE-2025-61932",
                "Motex LANSCOPE Endpoint Manager contains an improper verification of source of a communication channel vulnerability allowing an attacker to execute arbitrary code by sending specially crafted packets."
        ],
        [
                10048,
                1018,
                null,
                null,
                "HIGH",
                "CVE-2022-48503",
                "Apple macOS, iOS, tvOS, Safari, and watchOS contain an unspecified vulnerability in JavaScriptCore that when processing web content may lead to arbitrary code execution. The impacted product could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10049,
                1039,
                null,
                null,
                "HIGH",
                "CVE-2025-2746",
                "Kentico Xperience CMS contains an authentication bypass using an alternate path or channel vulnerability that could allow an attacker to control administrative objects."
        ],
        [
                10050,
                1039,
                null,
                null,
                "HIGH",
                "CVE-2025-2747",
                "Kentico Xperience CMS contains an authentication bypass using an alternate path or channel vulnerability that could allow an attacker to control administrative objects."
        ],
        [
                10051,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-33073",
                "Microsoft Windows SMB Client contains an improper access control vulnerability that could allow for privilege escalation. An attacker could execute a specially crafted malicious script to coerce the victim machine to connect back to the attack system using SMB and authenticate."
        ],
        [
                10052,
                1040,
                null,
                null,
                "HIGH",
                "CVE-2025-61884",
                "Oracle E-Business Suite contains a server-side request forgery (SSRF) vulnerability in the Runtime component of Oracle Configurator. This vulnerability is remotely exploitable without authentication."
        ],
        [
                10053,
                1041,
                null,
                null,
                "HIGH",
                "CVE-2025-54253",
                "Adobe Experience Manager Forms in JEE contains an unspecified vulnerability that allows for arbitrary code execution."
        ],
        [
                10054,
                1042,
                null,
                null,
                "HIGH",
                "CVE-2025-47827",
                "IGEL OS contains a use of a key past its expiration date vulnerability that allows for Secure Boot bypass. The igel-flash-driver module improperly verifies a cryptographic signature. Ultimately, a crafted root filesystem can be mounted from an unverified SquashFS image."
        ],
        [
                10055,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-24990",
                "Microsoft Windows Agere Modem Driver contains an untrusted pointer dereference vulnerability that allows for privilege escalation. An attacker who successfully exploited this vulnerability could gain administrator privileges."
        ],
        [
                10056,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2025-59230",
                "Microsoft Windows contains an improper access control vulnerability in Windows Remote Access Connection Manager which could allow an authorized attacker to elevate privileges locally."
        ],
        [
                10057,
                1043,
                null,
                null,
                "HIGH",
                "CVE-2016-7836",
                "SKYSEA Client View contains an improper authentication vulnerability that allows remote code execution via a flaw in processing authentication on the TCP connection with the management console program."
        ],
        [
                10058,
                1044,
                null,
                null,
                "HIGH",
                "CVE-2021-43798",
                "Grafana contains a path traversal vulnerability that could allow access to local files."
        ],
        [
                10059,
                1045,
                null,
                null,
                "HIGH",
                "CVE-2025-27915",
                "Synacor Zimbra Collaboration Suite (ZCS) contains a cross-site scripting vulnerability that exists in the Classic Web Client due to insufficient sanitization of HTML content in ICS files. When a user views an e-mail message containing a malicious ICS entry, its embedded JavaScript executes via an ontoggle event inside a tag. This allows an attacker to run arbitrary JavaScript within the victim's session, potentially leading to unauthorized actions such as setting e-mail filters to redirect messages to an attacker-controlled address. As a result, an attacker can perform unauthorized actions on the victim's account, including e-mail redirection and data exfiltration."
        ],
        [
                10060,
                1046,
                null,
                null,
                "HIGH",
                "CVE-2021-22555",
                "Linux Kernel contains a heap out-of-bounds write vulnerability that could allow an attacker to gain privileges or cause a DoS (via heap memory corruption) through user name space."
        ],
        [
                10061,
                1047,
                null,
                null,
                "HIGH",
                "CVE-2010-3962",
                "Microsoft Internet Explorer contains an uninitialized memory corruption vulnerability that could allow for remote code execution. The impacted product could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10062,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2021-43226",
                "Microsoft Windows Common Log File System Driver contains a privilege escalation vulnerability that could allow a local, privileged attacker to bypass certain security mechanisms."
        ],
        [
                10063,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2013-3918",
                "Microsoft Windows contains an out-of-bounds write vulnerability in the InformationCardSigninHelper Class ActiveX control, icardie.dll. An attacker could exploit the vulnerability by constructing a specially crafted webpage. When a user views the webpage, the vulnerability could allow remote code execution. An attacker who successfully exploited this vulnerability could gain the same user rights as the current user. The impacted product could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10064,
                1006,
                null,
                null,
                "HIGH",
                "CVE-2011-3402",
                "Microsoft Windows Kernel contains an unspecified vulnerability in the TrueType font parsing engine in win32k.sys in the kernel-mode drivers that allows remote attackers to execute arbitrary code via crafted font data in a Word document or web page."
        ],
        [
                10065,
                1048,
                null,
                null,
                "HIGH",
                "CVE-2010-3765",
                "Mozilla Firefox, SeaMonkey, and Thunderbird contain an unspecified vulnerability when JavaScript is enabled. This allows remote attackers to execute arbitrary code via vectors related to nsCSSFrameConstructor::ContentAppended, the appendChild method, incorrect index tracking, and the creation of multiple frames, which triggers memory corruption."
        ],
        [
                10066,
                1040,
                null,
                null,
                "HIGH",
                "CVE-2025-61882",
                "Oracle E-Business Suite contains an unspecified vulnerability in the BI Publisher Integration component. The vulnerability allows unauthenticated attacker with network access via HTTP to compromise Oracle Concurrent Processing. Successful attacks can result in takeover of Oracle Concurrent Processing."
        ],
        [
                10067,
                1049,
                null,
                null,
                "HIGH",
                "CVE-2014-6278",
                "GNU Bash contains an OS command injection vulnerability which allows remote attackers to execute arbitrary commands via a crafted environment."
        ],
        [
                10068,
                1050,
                null,
                null,
                "HIGH",
                "CVE-2017-1000353",
                "Jenkins contains a remote code execution vulnerability. This vulnerability that could allowed attackers to transfer a serialized Java SignedObject object to the remoting-based Jenkins CLI, that would be deserialized using a new ObjectInputStream, bypassing the existing blocklist-based protection mechanism."
        ],
        [
                10069,
                1051,
                null,
                null,
                "HIGH",
                "CVE-2015-7755",
                "Juniper ScreenOS contains an improper authentication vulnerability that could allow unauthorized remote administrative access to the device."
        ],
        [
                10070,
                1032,
                null,
                null,
                "HIGH",
                "CVE-2025-21043",
                "Samsung mobile devices contain an out-of-bounds write vulnerability in libimagecodec.quram.so which allows remote attackers to execute arbitrary code."
        ],
        [
                10071,
                1052,
                null,
                null,
                "HIGH",
                "CVE-2025-4008",
                "Smartbedded Meteobridge contains a command injection vulnerability that could allow remote unauthenticated attackers to gain arbitrary command execution with elevated privileges (root) on affected devices."
        ],
        [
                10072,
                1053,
                null,
                null,
                "HIGH",
                "CVE-2025-32463",
                "Sudo contains an inclusion of functionality from untrusted control sphere vulnerability. This vulnerability could allow local attacker to leverage sudo’s -R (--chroot) option to run arbitrary commands as root, even if they are not listed in the sudoers file."
        ],
        [
                10073,
                1054,
                null,
                null,
                "HIGH",
                "CVE-2025-59689",
                "Libraesva Email Security Gateway (ESG) contains a command injection vulnerability which allows command injection via a compressed e-mail attachment."
        ],
        [
                10074,
                1055,
                null,
                null,
                "HIGH",
                "CVE-2025-10035",
                "Fortra GoAnywhere MFT contains a deserialization of untrusted data vulnerability allows an actor with a validly forged license response signature to deserialize an arbitrary actor-controlled object, possibly leading to command injection."
        ],
        [
                10075,
                1056,
                null,
                null,
                "HIGH",
                "CVE-2025-20352",
                "Cisco IOS and IOS XE contains a stack-based buffer overflow vulnerability in the Simple Network Management Protocol (SNMP) subsystem that could allow for denial of service or remote code execution. A successful exploit could allow a low-privileged attacker to cause the affected system to reload, resulting in a DoS condition, or allow a high-privileged attacker to execute arbitrary code as the root user and obtain full control of the affected system."
        ],
        [
                10076,
                1057,
                null,
                null,
                "HIGH",
                "CVE-2021-21311",
                "Adminer contains a server-side request forgery vulnerability that, when exploited, allows a remote attacker to obtain potentially sensitive information."
        ],
        [
                10077,
                1058,
                null,
                null,
                "HIGH",
                "CVE-2025-20362",
                "Cisco Secure Firewall Adaptive Security (ASA) Appliance and Secure Firewall Threat Defense (FTD) Software VPN Web Server contain a missing authorization vulnerability. This vulnerability could be chained with CVE-2025-20333."
        ],
        [
                10078,
                1058,
                null,
                null,
                "HIGH",
                "CVE-2025-20333",
                "Cisco Secure Firewall Adaptive Security (ASA) Appliance and Secure Firewall Threat Defense (FTD) Software VPN Web Server contain a buffer overflow vulnerability that allows for remote code execution. This vulnerability could be chained with CVE-2025-20362."
        ],
        [
                10079,
                1029,
                null,
                null,
                "HIGH",
                "CVE-2025-10585",
                "Google Chromium contains a type confusion vulnerability in the V8 JavaScript and WebAssembly engine."
        ],
        [
                10080,
                1036,
                null,
                null,
                "HIGH",
                "CVE-2025-5086",
                "Dassault Systèmes DELMIA Apriso contains a deserialization of untrusted data vulnerability that could lead to a remote code execution."
        ],
        [
                10081,
                1046,
                null,
                null,
                "HIGH",
                "CVE-2025-38352",
                "Linux kernel contains a time-of-check time-of-use (TOCTOU) race condition vulnerability that has a high impact on confidentiality, integrity, and availability."
        ],
        [
                10082,
                1059,
                null,
                null,
                "HIGH",
                "CVE-2025-48543",
                "Android Runtime contains a use-after-free vulnerability potentially allowing a chrome sandbox escape leading to local privilege escalation."
        ],
        [
                10083,
                1060,
                null,
                null,
                "HIGH",
                "CVE-2025-53690",
                "Sitecore Experience Manager (XM), Experience Platform (XP), Experience Commerce (XC), and Managed Cloud contain a deserialization of untrusted data vulnerability involving the use of default machine keys. This flaw allows attackers to exploit exposed ASP.NET machine keys to achieve remote code execution. "
        ],
        [
                10084,
                1061,
                null,
                null,
                "HIGH",
                "CVE-2023-50224",
                "TP-Link TL-WR841N contains an authentication bypass by spoofing vulnerability within the httpd service, which listens on TCP port 80 by default, leading to the disclose of stored credentials. The impacted products could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10085,
                1062,
                null,
                null,
                "HIGH",
                "CVE-2025-9377",
                "TP-Link Archer C7(EU) and TL-WR841N/ND(MS) contain an OS command injection vulnerability that exists in the Parental Control page. The impacted products could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10086,
                1063,
                null,
                null,
                "HIGH",
                "CVE-2020-24363",
                "TP-link TL-WA855RE contains a missing authentication for critical function vulnerability. This vulnerability could allow an unauthenticated attacker (on the same network) to submit a TDDP_RESET POST request for a factory reset and reboot. The attacker can then obtain incorrect access control by setting a new administrative password. The impacted products could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ],
        [
                10087,
                1064,
                null,
                null,
                "HIGH",
                "CVE-2025-55177",
                "Meta Platforms WhatsApp contains an incorrect authorization vulnerability due to an incomplete authorization of linked device synchronization messages. This vulnerability could allow an unrelated user to trigger processing of content from an arbitrary URL on a target’s device."
        ],
        [
                10088,
                1065,
                null,
                null,
                "HIGH",
                "CVE-2025-57819",
                "Sangoma FreePBX contains an authentication bypass vulnerability due to insufficiently sanitized user-supplied data allows unauthenticated access to FreePBX Administrator leading to arbitrary database manipulation and remote code execution."
        ],
        [
                10089,
                1066,
                null,
                null,
                "HIGH",
                "CVE-2025-7775",
                "Citrix NetScaler ADC and NetScaler Gateway contain a memory overflow vulnerability that could allow for remote code execution and/or denial of service."
        ],
        [
                10090,
                1067,
                null,
                null,
                "HIGH",
                "CVE-2025-48384",
                "Git contains a link following vulnerability that stems from Git’s inconsistent handling of carriage return characters in configuration files."
        ],
        [
                10091,
                1068,
                null,
                null,
                "HIGH",
                "CVE-2024-8068",
                "Citrix Session Recording contains an improper privilege management vulnerability that could allow for privilege escalation to NetworkService Account access. An attacker must be an authenticated user in the same Windows Active Directory domain as the session recording server domain."
        ],
        [
                10092,
                1068,
                null,
                null,
                "HIGH",
                "CVE-2024-8069",
                "Citrix Session Recording contains a deserialization of untrusted data vulnerability that allows limited remote code execution with privilege of a NetworkService Account access. Attacker must be an authenticated user on the same intranet as the session recording server."
        ],
        [
                10093,
                1069,
                null,
                null,
                "HIGH",
                "CVE-2025-43300",
                "Apple iOS, iPadOS, and macOS contain an out-of-bounds write vulnerability in the Image I/O framework."
        ],
        [
                10094,
                1070,
                null,
                null,
                "HIGH",
                "CVE-2025-54948",
                "Trend Micro Apex One Management Console (on-premise) contains an OS command injection vulnerability that could allow a pre-authenticated remote attacker to upload malicious code and execute commands on affected installations."
        ],
        [
                10095,
                1071,
                null,
                null,
                "HIGH",
                "CVE-2025-8876",
                "N-able N-Central contains a command injection vulnerability via improper sanitization of user input."
        ],
        [
                10096,
                1071,
                null,
                null,
                "HIGH",
                "CVE-2025-8875",
                "N-able N-Central contains an insecure deserialization vulnerability that could lead to command execution."
        ],
        [
                10097,
                1022,
                null,
                null,
                "HIGH",
                "CVE-2025-8088",
                "RARLAB WinRAR contains a path traversal vulnerability affecting the Windows version of WinRAR. This vulnerability could allow an attacker to execute arbitrary code by crafting malicious archive files."
        ],
        [
                10098,
                1008,
                null,
                null,
                "HIGH",
                "CVE-2007-0671",
                "Microsoft Office Excel contains a remote code execution vulnerability that can be exploited when a specially crafted Excel file is opened. This malicious file could be delivered as an email attachment or hosted on a malicious website. An attacker could leverage this vulnerability by creating a specially crafted Excel file, which, when opened, allowing an attacker to execute remote code on the affected system."
        ],
        [
                10099,
                1047,
                null,
                null,
                "HIGH",
                "CVE-2013-3893",
                "Microsoft Internet Explorer contains a memory corruption vulnerability that allows for remote code execution. The impacted products could be end-of-life (EoL) and/or end-of-service (EoS). Users should discontinue product utilization."
        ]
]
    }
];
