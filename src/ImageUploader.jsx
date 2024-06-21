import React, { useState } from "react";
import axios from "axios";


const ImageUploader = () => {
  const [galleryImage, setGalleryImage] = useState(null);
  const [probeImage, setProbeImage] = useState(null);
  const [searchMode, setSearchMode] = useState("FAST"); // Valor por defecto
  const [score, setScore] = useState(null);

  // Manejar cambios en las imágenes seleccionadas
  const handleGalleryImageChange = (e) => {
    setGalleryImage(e.target.files[0]);
  };

  const handleProbeImageChange = (e) => {
    setProbeImage(e.target.files[0]);
  };

  // Función para enviar la solicitud POST con las imágenes
  const postDataWithImages = async () => {
    const url = "https://us.opencv.fr/compare";
    const apiKey = process.envREACT_APP_API;

    try {
      // Convertir las imágenes a base64
      const galleryBase64 = await convertImageToBase64(galleryImage);
      const probeBase64 = await convertImageToBase64(probeImage);

      // Construir el cuerpo de la solicitud
      const bodyData = {
        gallery: [galleryBase64],
        probe: [probeBase64],
        search_mode: searchMode,
      };

      // Realizar la solicitud POST
      const response = await axios.post(url, bodyData, {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
      });

      if (response.data && response.data.score) {
        setScore(response.data.score);
      } else {
        setScore(null);
      }
      console.log(response.data); // Aquí obtienes la respuesta JSON
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // Función para convertir una imagen a base64
  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      if (!imageFile) {
        resolve(null);
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Remover el prefijo 'data:image/jpeg;base64,'
        reader.onerror = (error) => reject(error);
      }
    });
  };

  return (
    <div>
      <h2>Image Uploader</h2>
      <div>
        <label>Gallery Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleGalleryImageChange}
        />
      </div>
      <div>
        <label>Probe Image:</label>
        <input type="file" accept="image/*" onChange={handleProbeImageChange} />
      </div>
      <div>
        <label>Search Mode:</label>
        <select
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value)}
        >
          <option value="FAST">FAST</option>
          <option value="ACCURATE">ACCURATE</option>
        </select>
      </div>
      <button onClick={postDataWithImages}>Enviar Datos</button>
      {score !== null && (
        <div>
          <p>Score recibido: {score}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
