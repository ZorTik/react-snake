import Board from "./Board";
import {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {solid} from "@fortawesome/fontawesome-svg-core/import.macro";

function App() {
    const [useDarkMode, setUseDarkMode] = useState<boolean>(true);
    return (
        <div className={`${useDarkMode ? "dark" : ""} w-full h-[100vh] relative`}>
            <div className={`w-full h-full flex justify-center items-center bg-neutral-100 dark:bg-gray-900`}>
                <Board dimension={800} className="mx-10" />
                <div className="w-fit h-[800px] absolute right-0 top-0 p-12">
                    <button onClick={() => setUseDarkMode(!useDarkMode)}>
                        <FontAwesomeIcon icon={useDarkMode ? solid("sun") : solid("moon")} className="w-8 h-8 dark:text-neutral-200" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
