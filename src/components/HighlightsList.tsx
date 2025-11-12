import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, Trash2, Edit2, Check, X, Download } from "lucide-react";
import { useState } from "react";

export interface Highlight {
  id: string;
  timestamp: number;
  note: string;
  formattedTime: string;
}

interface HighlightsListProps {
  highlights: Highlight[];
  onDeleteHighlight: (id: string) => void;
  onUpdateHighlight: (id: string, note: string) => void;
  onExportHighlights: () => void;
  isRecording: boolean;
}

const HighlightsList = ({
  highlights,
  onDeleteHighlight,
  onUpdateHighlight,
  onExportHighlights,
  isRecording,
}: HighlightsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");

  const handleStartEdit = (highlight: Highlight) => {
    setEditingId(highlight.id);
    setEditNote(highlight.note);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateHighlight(id, editNote);
    setEditingId(null);
    setEditNote("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNote("");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-accent" />
          Highlights ({highlights.length})
        </h3>
        {highlights.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onExportHighlights}
            disabled={isRecording}
          >
            <Download className="w-4 h-4 mr-1" />
            Esporta
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        {highlights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nessun highlight segnato</p>
            <p className="text-xs mt-1">
              Premi il pulsante stella durante la registrazione
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {highlights.map((highlight) => (
              <Card key={highlight.id} className="p-3 bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-accent text-accent-foreground px-2 py-1 rounded text-sm font-mono font-semibold">
                        {highlight.formattedTime}
                      </div>
                    </div>
                    {editingId === highlight.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editNote}
                          onChange={(e) => setEditNote(e.target.value)}
                          placeholder="Aggiungi una nota..."
                          className="h-8"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(highlight.id);
                            } else if (e.key === "Escape") {
                              handleCancelEdit();
                            }
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleSaveEdit(highlight.id)}
                        >
                          <Check className="w-4 h-4 text-primary" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground">
                        {highlight.note || (
                          <span className="text-muted-foreground italic">
                            Nessuna nota
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  {editingId !== highlight.id && (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleStartEdit(highlight)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => onDeleteHighlight(highlight.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default HighlightsList;
