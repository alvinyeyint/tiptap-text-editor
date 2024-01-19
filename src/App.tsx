import KTextEditor from "./KTextEditor";
import { useState } from "react";
import "../app/globals.css";

function App() {
  const [content, setContent] = useState(
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci consequatur illo autem asperiores, non a libero nam voluptates. Pariatur, quibusdam illum. Quasi saepe culpa architecto iusto eum omnis magni qui! "
  );

  return (
    <>
      <div className="w-1/2">
        <h2 className="text-xl text-blue-600 font-semibold leading-7 mb-3">
          Tiptap editor
        </h2>
        <KTextEditor value={content} onChange={(value) => setContent(value)} />
      </div>

      <div className="grid grid-cols-2 gap-4 my-3">
        <div className="my-3">
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            HTML Output :
          </p>
          <p className="k-card">{content}</p>
        </div>

        <div className="my-3">
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Preview :
          </p>
          <div
            className="k-card"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
    </>
  );
}

export default App;
