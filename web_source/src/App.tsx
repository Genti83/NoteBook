/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Notepad } from './components/Notepad';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center sm:p-4 selection:bg-blue-500/30">
      <Notepad />
    </div>
  );
}
