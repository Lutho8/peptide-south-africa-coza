import { MessageCircle, Mail, CalendarCheck, ShoppingBag, ExternalLink } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SupportSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WA_HREF = 'https://wa.me/491624747159?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Peptide%20South%20Africa';
const BOOK_HREF = 'mailto:webinars@fintiba.com?subject=Consultation%20Request%20%E2%80%94%20Peptide%20South%20Africa';
const EMAIL_HREF = 'mailto:support@peptide-south-africa.co.za?subject=Support%20%E2%80%94%20Peptide%20South%20Africa';
const SHOP_HREF = 'https://peptide-south-africa.com/?utm_source=psa_app&utm_medium=support&utm_campaign=shop';
const CLUB_HREF = 'https://capetownpeptideclub.co.za';

interface Row {
  icon: React.ReactNode;
  label: string;
  sub: string;
  href: string;
  accent: string;
}

const rows: Row[] = [
  {
    icon: <MessageCircle size={20} />,
    label: 'WhatsApp chat',
    sub: 'Fastest response — usually within an hour',
    href: WA_HREF,
    accent: 'bg-[#25D366]/15 text-[#25D366]',
  },
  {
    icon: <CalendarCheck size={20} />,
    label: 'Book a consultation',
    sub: '1:1 expert call with a peptide researcher',
    href: BOOK_HREF,
    accent: 'bg-primary/15 text-primary',
  },
  {
    icon: <Mail size={20} />,
    label: 'Email support',
    sub: 'For account, billing or data questions',
    href: EMAIL_HREF,
    accent: 'bg-accent/20 text-accent-foreground',
  },
  {
    icon: <ShoppingBag size={20} />,
    label: 'Shop peptides',
    sub: 'peptide-south-africa.com',
    href: SHOP_HREF,
    accent: 'bg-amber-500/15 text-amber-500',
  },
  {
    icon: <ExternalLink size={20} />,
    label: 'Cape Town Peptide Club',
    sub: 'Invite-only community & events',
    href: CLUB_HREF,
    accent: 'bg-green-500/15 text-green-500',
  },
];

export function SupportSheet({ open, onOpenChange }: SupportSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>How can we help?</SheetTitle>
          <SheetDescription>
            Pick the fastest way to reach the Peptide South Africa team.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex flex-col gap-2 pb-4">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target={r.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 min-h-14 transition-all hover:border-primary/40 hover:bg-card/80 active:scale-[0.98]"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${r.accent}`}>
                {r.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-foreground leading-tight">{r.label}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{r.sub}</p>
              </div>
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
