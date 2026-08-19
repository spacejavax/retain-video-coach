import { IS_DEMO_MODE } from "../lib/config";
import { RetainApp } from "./components/retain-app";

export default function Home() { return <RetainApp demoMode={IS_DEMO_MODE} />; }
