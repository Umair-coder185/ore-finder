/**
 * Primary, secondary, and legal navigation structures for OreFinder.io
 */

/**
 * @typedef {Object} NavItem
 * @property {string} label
 * @property {string} href
 * @property {string} [description]
 */

/** @type {NavItem[]} */
export const primaryNavigation = [
  {
    label: "Ore Finder",
    href: "/#workspace",
    description: "Interactive world analysis & ore configuration workspace",
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Technical Minecraft world-generation & ore strata guides",
  },
  {
    label: "About",
    href: "/about",
    description: "Platform mission, methodology, and accuracy standards",
  },
];

/** @type {NavItem[]} */
export const resourceNavigation = [
  { label: "Ore Finder Workspace", href: "/#workspace" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Supported Ores", href: "/#supported-ores" },
  { label: "Technical Methodology", href: "/methodology" },
  { label: "Field Guides & Blog", href: "/blog" },
];

/** @type {NavItem[]} */
export const companyNavigation = [
  { label: "About OreFinder.io", href: "/about" },
  { label: "Contact & Feedback", href: "/contact" },
  { label: "Technical Disclaimer", href: "/disclaimer" },
];

/** @type {NavItem[]} */
export const legalNavigation = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];
