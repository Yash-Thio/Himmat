import {
  Binoculars,
  ChartLine,
  ChatsTeardrop,
  PiggyBank,
  Smiley,
  UserCheck,
} from "@phosphor-icons/react/dist/ssr";

import SectionWrapper from "./section-wrapper";

const features = [
  {
    name: "Panic Button for Safety",
    description:
      "Easily let your closest police station and your family know your location in case of an emergency.",
    href: "#",
    icon: Binoculars,
  },
  {
    name: "100% Free Access for All Users",
    description:
      "Himmat offers full access to all features without any fees. Travel safe without any costs.",
    href: "#",
    icon: PiggyBank,
  },
  {
    name: "In-Platform Messaging",
    description:
      "Connect directly with your trusted ones through our secure chat feature.",
    href: "#",
    icon: ChatsTeardrop,
  },
  {
    name: "Simple Onboarding",
    description:
      "Influencers can join quickly by connecting their Instagram and filling in essential details, ensuring verified, authentic profiles for brands to browse.",
    href: "#",
    icon: UserCheck,
  },
  {
    name: "Safe Route Suggestions",
    description:
      "Get insights into influencers' engagement rates, audience demographics, and follower growth to make informed collaboration decisions.",
    href: "#",
    icon: ChartLine,
  },
  {
    name: "Intuitive & Easy-to-Use Interface",
    description:
      "Himmat intuitive design makes it simple for brands and influencers to connect and collaborate effortlessly.",
    href: "#",
    icon: Smiley,
  },
];

export default function Features() {
  return (
    <SectionWrapper
      center
      description="Explore our powerful features designed to make collaboration effortless."
      id="features"
      prefixTitle="Key Features"
      title="Everything You Need For A Safe Journey"
    >
      <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
        {features.map((feature) => (
          <div className="flex flex-col" key={feature.name}>
            <dt className="flex items-center gap-x-3 font-poppins text-lg font-semibold leading-7">
              <feature.icon
                aria-hidden="true"
                className="size-7 flex-none text-secondary-foreground"
              />
              {feature.name}
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
              <p className="flex-auto">{feature.description}</p>
            </dd>
          </div>
        ))}
      </dl>
    </SectionWrapper>
  );
}
