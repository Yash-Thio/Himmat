import Link from "next/link";

export default function Footer({
  links,
}: {
  links: { name: string; href: string }[];
}) {
  return (
    <footer className="">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-16 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
        >
          {links.map((item) => (
            <div className="pb-6 text-center" key={item.name}>
              <Link
                className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                href={item.href}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
