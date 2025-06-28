import { useState } from "react";
import {
  PdfIcon,
  WordIcon,
  ExcelIcon,
  GenericFileIcon,
  MusicIcon,
  VideoIcon,
} from "../../../ui/icons/AttachIcon";
import { DownloadIcon } from "../../../ui/icons";

function CardAttachment({
  id,
  fileUrl,
  onDelete,
  filename,
  contentType,
  readOnly,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isImage = contentType?.startsWith("image/");

  // Selecciona un ícono específico según el tipo MIME
  const getFileIcon = () => {
    if (contentType?.includes("pdf"))
      return (
        <PdfIcon className={"bg-danger-badge rounded-3 p-3"} size={"7rem"} />
      );
    if (contentType?.includes("word"))
      return (
        <WordIcon className={"bg-blue-badge rounded-3 p-3"} size={"7rem"} />
      );
    if (
      contentType?.includes("spreadsheetml") ||
      contentType?.includes("ms-excel")
    )
      return (
        <ExcelIcon
          className={"bg-green-badge text-success rounded-3 p-3"}
          size={"7rem"}
        />
      );
    if (contentType?.includes("zip"))
      return (
        <GenericFileIcon
          className={"bg-orange-badge rounded-3 p-3"}
          size={"7rem"}
        />
      );
    if (contentType?.includes("audio"))
      return (
        <MusicIcon className={"bg-pink-badge rounded-3 p-3"} size={"7rem"} />
      );
    if (contentType?.includes("video"))
      return (
        <VideoIcon className={"bg-violet-badge rounded-3 p-3"} size={"7rem"} />
      );
    return (
      <GenericFileIcon
        className={"bg-orange-badge rounded-3 p-3"}
        size={"7rem"}
      />
    );
  };

  return (
    <article>
      <div
        className="card overflow-hidden position-relative mt-2"
        style={{ height: 200 }}
        onClick={() => isImage && setIsFullScreen(!isFullScreen)}
      >
        {isImage ? (
          // Imagen con preview
          <div className={`w-100 ${isFullScreen ? "full-screen" : ""}`}>
            <img
              src={fileUrl}
              className="img-fluid cursor-pointer"
              alt={`Attachment ${id}`}
            />
          </div>
        ) : (
          // Vista para archivos no imagen
          <div className="d-flex flex-column justify-content-between mt-4 h-100 w-100 align-items-center">
            <div className="d-flex justify-content-center align-items-center h-100">
              {getFileIcon()}
            </div>
            <p
              className="mb-2 small text-truncate"
              style={{ maxWidth: "90%", overflow: "hidden" }}
            >
              {filename || "Archivo adjunto"}
            </p>
          </div>
        )}

        {/* Botón de eliminar */}
        {!readOnly && (
          <div className="position-absolute d-flex gap-1 end-0 top-0 text-center m-1">
            <a
              name="downloadBtn"
              type="button"
              href={fileUrl}
              onClick={(e) => e.stopPropagation()}
              download={filename}
              className="d-flex p-0 border-0 btn-close-bg btn-text-bg justify-content-center align-items-center"
            >
              <DownloadIcon size="0.9rem" />
            </a>
            <button
              name="deleteBtn"
              type="button"
              onClick={() => onDelete(id)}
              className="d-flex text-center p-0 border-0 btn-close-bg btn-text-bg {
  color: var(--bs-body-color);
} justify-content-center align-items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.1rem"}
              >
                <path d="M14.121,12,18,8.117A1.5,1.5,0,0,0,15.883,6L12,9.879,8.11,5.988A1.5,1.5,0,1,0,5.988,8.11L9.879,12,6,15.882A1.5,1.5,0,1,0,8.118,18L12,14.121,15.878,18A1.5,1.5,0,0,0,18,15.878Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default CardAttachment;
