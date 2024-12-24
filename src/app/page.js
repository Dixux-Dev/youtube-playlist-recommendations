"use client";
import ToggleTheme from "@/components/toggleTheme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { useEffect, useState } from "react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 800);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const searchHN = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/searchSong?query=${encodeURIComponent(debouncedSearchQuery)}`
        );
        if (!response.ok) {
          throw new Error("Error al realizar la búsqueda.");
        }

        const data = await response.json();
        console.log(data);
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedSearchQuery !== "") {
      searchHN();
    }
  }, [debouncedSearchQuery]);

  const [playlist, setPlaylist] = useState([]);

  const addToPlaylist = (song) => {
    if (!playlist.find((item) => item.id === song.id)) {
      setPlaylist([...playlist, song]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeFromPlaylist = (songId) => {
    setPlaylist(playlist.filter((song) => song.id !== songId));
  };

  return (
    <>
      <div className="container px-5 mx-auto flex justify-between py-5 border-b border-b-slate-600">
        <div></div>
        <ToggleTheme></ToggleTheme>
      </div>
      <div className="container px-5 my-6 mx-auto">
        <div className="flex gap-3">
          <div className="w-1/2 p-3">
            <Input
              type="text"
              placeholder="Search..."
              onChange={handleChange}
              value={searchQuery}
            />
            <div className="space-y-2">
              {isLoading && (
                <div className="text-center py-4 text-gray-500">
                  Buscando...
                </div>
              )}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {debouncedSearchQuery !== ""
                ? searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-2 rounded-lg"
                      tabIndex={2}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <Image
                            src={song.thumbnail}
                            width={120}
                            height={90}
                            alt="Picture of the author"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{song.title}</h3>
                          <p className="text-sm text-gray-500">{song.artist}</p>
                        </div>
                      </div>
                      <Button onClick={() => addToPlaylist(song)}>+</Button>
                    </div>
                  ))
                : ""}
            </div>
          </div>
          <div className="w-1/2 p-3">
            <h3>Songs:</h3>
            <div className="space-y-2">
              {playlist.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Tu playlist está vacía. Busca canciones para agregar.
                </div>
              ) : (
                playlist.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{song.title}</h3>
                        <p className="text-sm text-gray-500">{song.artist}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeFromPlaylist(song.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <span className="sr-only">Eliminar</span>×
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
