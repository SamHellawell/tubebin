import { useState } from 'react'
import Link from 'next/link';
import dynamic from 'next/dynamic';

import AboutText from './about-text';
import TOSText from './tos-text';

const Dialog = dynamic(() => import('./dialog'));

export default function TubebinFooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTOSOpen, setTOSIsOpen] = useState(false);

  function handleOpenAbout(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function handleOpenTOS(e) {
    e.preventDefault();
    setTOSIsOpen(true);
  }

  return (
    <footer className="flex items-center justify-center w-full h-24 border-t bg-gray-100 text-gray-600">
      <Link href="/terms" passHref>
        <a
          className="flex items-center justify-center mr-2 ml-8"
          onClick={handleOpenTOS}
        >
          Terms & Privacy
        </a>
      </Link>

      <Link href="/about" passHref>
        <a
          className="flex items-center justify-center mr-auto ml-8 cursor-pointer"
          onClick={handleOpenAbout}
        >
          About
        </a>
      </Link>
      <a
        className="flex items-center justify-center mr-8 ml-auto hidden md:flex"
        href="https://github.com/SamHellawell/tubebin"
        target="_blank"
        rel="noopener noreferrer"
      >
        tubebin is experimental software
      </a>

      <Dialog
        title="About tubebin"
        {...{isOpen, setIsOpen}}>
        <AboutText />
      </Dialog>

      <Dialog
        title="tubebin terms and privacy"
        {...{isOpen: isTOSOpen, setIsOpen: setTOSIsOpen}}>
        <TOSText />
      </Dialog>
    </footer>
  );
}
