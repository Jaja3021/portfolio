import { EnvelopeIcon as Mail, MessengerLogoIcon as Messenger, PhoneIcon as Phone } from "@phosphor-icons/react/ssr";
import { ContactForm } from "@/components/forms/ContactForm";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { COPY, SITE_CONFIG } from "@/config/site";
import { CONTACT_INFO } from "@/lib/constants";
import type { Property } from "@/lib/types";

const SOCIAL_LINKS = [
  { href: CONTACT_INFO.facebook, icon: FacebookIcon, label: "Facebook" },
  { href: CONTACT_INFO.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: CONTACT_INFO.tiktok, icon: TiktokIcon, label: "TikTok" },
  { href: CONTACT_INFO.youtube, icon: YoutubeIcon, label: "YouTube" },
];

const linkClass =
  "flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary";

export function Contact({ properties }: { properties: Property[] }) {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">Contact</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{COPY.contactIntro}</p>

          <div className="mt-8 flex flex-col gap-3">
            <a href={SITE_CONFIG.phoneHref} className={linkClass}>
              <Phone className="h-5 w-5 text-primary" aria-hidden />
              {CONTACT_INFO.phone}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className={linkClass}>
              <Mail className="h-5 w-5 text-primary" aria-hidden />
              {CONTACT_INFO.email}
            </a>
            <a href={SITE_CONFIG.messengerUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Messenger className="h-5 w-5 text-primary" aria-hidden />
              Message on Messenger
            </a>
          </div>

          <div className="mt-8 flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 lg:col-span-3">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Send an inquiry</h2>
          <p className="mb-6 mt-1 text-sm text-muted">Arnold will get back to you as soon as he can.</p>
          <ContactForm properties={properties} />
        </div>
      </div>
    </section>
  );
}
