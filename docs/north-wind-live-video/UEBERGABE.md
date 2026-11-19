# Übergabe: Live-Konzert-Video „The North Wind Calls"

Stand: 19.11.2026. Diese Datei fasst den Projektstand zusammen, damit ein anderer Assistent (z. B. Codex oder ChatGPT) ohne Vorwissen weiterarbeiten kann.

## 1. Ziel

Ein YouTube-Musikvideo in 16:9 zum Song „The North Wind Calls", das sich wie ein echter Live-Auftritt anfühlt. Auf der Bühne stehen die zwei Sängerinnen SUNRIVA (blond) und Sunny (dunkelhaarig) mit einer dreiköpfigen Band. Vorbild ist ein Konzertvideo mit schnellem Wechsel zwischen Sängerin und Publikum (56 Einstellungen in 2:26, im Schnitt alle 2,6 Sekunden, etwa die Hälfte Publikum und Totalen).

## 2. Ton

- Endgültige Tonspur: die Live-Fassung aus Suno, Datei `The_North_Wind_live_.mp3`, Länge 2:50, ca. 144 BPM, f-Moll.
- Der Gesang endet bei etwa 2:42, danach ca. 7 Sekunden Schlussklang mit Publikum. Die Datei endet etwas abrupt: im fertigen Video die letzten 2 Sekunden ausblenden.
- Im Song singt EINE Stimme (ältere Frau, tiefer Alt). Im Bild singen beide Frauen gemeinsam; Seedance entscheidet frei, wer welche Phrase singt.
- Besetzung laut Stil-Prompt: nordische Rahmentrommeln, tiefe Percussion, Bass. Keine Gitarren, kein Chor.
- Ältere Fassungen (Studio 2:42 und eine abgeschnittene Live-Fassung 2:39) NICHT mehr verwenden.

### Schwarze MP4s als Tonvorlage für die Lippen (je 30 s, 2 s Überlappung)

| Teil | Stelle im Song | Datei |
|---|---|---|
| 1 | 0:00 – 0:30 | NorthWindLIVE2_Teil1_000s.mp4 |
| 2 | 0:28 – 0:58 | NorthWindLIVE2_Teil2_028s.mp4 |
| 3 | 0:56 – 1:26 | NorthWindLIVE2_Teil3_056s.mp4 |
| 4 | 1:24 – 1:54 | NorthWindLIVE2_Teil4_084s.mp4 |
| 5 | 1:52 – 2:22 | NorthWindLIVE2_Teil5_112s.mp4 |
| 6 | 2:20 – 2:50 | NorthWindLIVE2_Teil6_140s.mp4 |

Die Überlappung erlaubt, den Schnitt zwischen zwei Clips frei zu legen, falls am Clip-Rand ein Wort zerschnitten ist.

## 3. Songtext

```
[Verse 1]
I was seven when the winter came
You wrapped your coat around me
Thunder rolled across the bay
I said, Mama, I'm afraid

[Pre-Chorus]
You held my face
And made me say

[Chorus]
When the north wind calls your name
Stand like stone and face the flame
Let it roar, let it rise
Keep that fire in your eyes
Hold the line, break on through
There's a fire inside of you

[Bridge]
You may bleed, you may cry
But never let your fire die

[Verse 2]
At eighteen I left our home
You kissed my head and let me go
You said, take my fire down every road

[Verse 3]
Years went by, then came your words
Come home soon
I rode all night
No candle burned when I arrived

[Break, quiet]
Now I'm seventy by that same cold sea
My granddaughter stands with me
She hears the thunder, grabs my hand
I see myself and understand

[Final Chorus]
When the north wind calls your name
Stand like stone and face the flame
Let it roar, let it rise
Keep that fire in your eyes
Hold the line, break on through
There's a fire inside of you

[Outro, soft]
She asks, who taught you so?
I watch the northern water glow
My mama did
Long ago
```

Welche Zeilen in welchem 30-Sekunden-Abschnitt liegen, ist NICHT gemessen. Deshalb im Prompt immer etwas mehr Text mitgeben und dazuschreiben, dass nur die hörbaren Worte gesungen werden.

## 4. Vorhandene Bilder (alle 16:9, mit ChatGPT erstellt)

| Bereich | Bild |
|---|---|
| Bühne | große Open-Air-Bühne in der Dämmerung an der Küste, senkrechte warmweiße Lichtstäbe, zwei Leinwände, Feuerschalen, Laufsteg mit runder Plattform in der Menge, Band auf der Bühne |
| Bühne | Blick von der Bühne über den Laufsteg ins Publikum |
| Sängerinnen | Sunny, Ganzkörper: schwarzes Kleid mit Schlitz rechts, ärmelloser Mantel, dunkles Fell auf der linken Schulter, Stiefel |
| Sängerinnen | SUNRIVA, Ganzkörper: cremefarbenes Kleid mit Schlitz, helles Fell auf der rechten Schulter, Ledergürtel, Stiefel |
| Sängerinnen | beide vor der Band (Startbild für Gesangsclips auf der Hauptbühne) |
| Sängerinnen | beide auf der Plattform in der Menge (Startbild für Bruch und Schlussrefrain) |
| Band | Trommler von der Seite, Arme erhoben |
| Band | Trommlerin von hinten mit Blick ins Publikum |
| Band | Streicherin nah (Tagelharpa) |
| Publikum | Handys; Frau mit geschlossenen Augen; Lichtermeer von hinten; Mutter und Tochter; Vater mit Tochter auf den Schultern; vier Freunde; zwei Frauen mit Herzschildern; jubelnde Jungs |

Bei den Publikumsbildern mit Gesichtern steht die Kamera zwischen Bühne und Publikum und schaut in die Menge zurück (Bühne nicht im Bild).

## 5. Seedance-Einstellungen (Higgsfield, Modell Seedance 2.5)

- Modus: Referenzen (Startbild + zwei Outfit-Bilder + schwarze MP4 als Videoreferenz)
- 16:9, 30 Sekunden, 480p für Tests, Bitrate hoch, KEIN Entwurfsmodus
- Ton: aus (die Suno-Live-Fassung liefert den Ton)
- Kosten: 90 Credits pro 30-Sekunden-Clip in 480p, 210 in 720p, 480 in 1080p
- Higgsfield-Medien-IDs: Startbild `4409668e-8062-4d35-b369-2036ce7a4dc7`, SUNRIVA `4f5b7e2e-ca38-4124-b463-46284f4cefc4`, Sunny `9a31cc32-d752-468d-9534-aae99f551004`

## 6. Was bisher erzeugt wurde und was daraus zu lernen ist

| Versuch | Ergebnis |
|---|---|
| Teil 1, Entwurf, ruhiger Prompt, alte Studio-Tonspur | vom Auftraggeber abgelehnt: Lippen passten nicht, Trommler nicht im Takt, Auftritt langweilig, klang nicht live |
| Teil 1, zwei Aufnahmen, lebendiger Prompt, Seedance-Ton an, alte Studio-Tonspur | sichtbar lebendiger (mehrere Kameraperspektiven, Gesten, Totale mit Publikum). Urteil des Auftraggebers zu Lippen und Ton steht noch aus. Der Seedance-Ton ist keine Kopie des Songs. |

Lehren:

1. Seedance KEINE Zeitangaben zum Gesang geben („am Anfang nur Musik" o. ä.). Es soll sich allein nach dem Ton der schwarzen MP4 richten.
2. Die Trommler nicht spielend ins Bild schreiben. Seedance trifft Instrumente nicht im Takt. Band unscharf im Hintergrund lassen; Trommelschläge als eigene kurze Clips erzeugen und im Schnitt auf die Taktschläge legen.
3. „Ruhig, langsam, keine schnellen Schnitte" führt zu einem öden Clip. Bewegung, große Gesten und aktive Kamera verlangen.
4. Die Lippen müssen mit genau der Tonspur erzeugt werden, die am Ende im Video läuft. Clips aus der alten Studio-Fassung passen nicht zur Live-Fassung.
5. Bei einer Zeitüberschreitung beim Start NICHT sofort neu senden: der Auftrag kann trotzdem angekommen sein (ist einmal passiert, doppelte Abbuchung).

## 7. Aktueller Seedance-Prompt (Vorlage für alle Gesangsclips)

Für jeden Teil werden nur die schwarze MP4 und der Lyrics-Block ausgetauscht. Für Teil 5 und 6 das Startbild „beide auf der Plattform" verwenden.

```
The start image shows the two singers on stage. The blonde woman in the
cream dress with the pale fur on her shoulder is SUNRIVA. The
dark-haired woman in the black dress with the dark fur on her shoulder
is Sunny. The two reference images show each of them in full: keep each
face, hair, tattoos, jewelry and complete outfit exactly as in her
reference. @Video1 is the sole audio and vocal timing reference: ignore
its black image, only its sound matters.

Photorealistic live concert footage on a large open-air stage at dusk,
a huge cheering crowd in front, 16:9.

LIP SYNC — HIGHEST PRIORITY
The two women sing the original vocals from @Video1 as a duet. Their
lip movements follow every audible word, syllable, breath and sustained
vowel of the recording precisely. @Video1 alone determines when singing
starts, pauses and ends. They sing only while a voice is audible and
never invent words. Let the recording guide who sings each phrase:
sometimes one of them, sometimes both together.

LIVE PERFORMANCE
Two charismatic, confident live performers who love their audience and
genuinely feel the music. They are never standing still: they walk the
stage, move with the rhythm, step to the front edge, turn to each other
and to different parts of the crowd. Big natural gestures: an arm
thrown open to the audience, pointing into the crowd with a smile,
a raised fist on a strong beat, a hand inviting the crowd to sing
along, a hand on the heart on an emotional line. Each keeps one black
handheld microphone in her right hand, close to her lips while singing.
Spontaneous, expressive, never stiff or posed.

The three musicians stay in the background, out of focus, moving with
the music. The camera never features them.

CAMERA
Energetic professional live-concert camera work, like a filmed show
with several cameras. Dynamic tracking shots, quick natural push-ins,
side angles, a low angle from the front row, one wider shot of the
stage with the crowd's raised hands in the foreground. Cuts follow the
musical phrases. Keep the singing mouths clearly visible.

LYRICS — WORD RECOGNITION ONLY
These lines help identify the words. They are not a timing guide. Sing
only the words actually audible in @Video1, in their original order.

[Zeilen des jeweiligen Abschnitts einsetzen, lieber ein paar mehr]

Natural skin texture, real stage lighting, haze, no text, no subtitles.
```

## 8. Offene Aufgaben

1. Teil 1 mit der Live-Fassung als Tonvorlage neu erzeugen und Lippen prüfen lassen.
2. Bei Erfolg Teil 2 bis 6 erzeugen (je 90 Credits in 480p).
3. Publikumsbilder zu kurzen Clips animieren (4 bis 5 Sekunden, ohne Lippensynchronität).
4. Drei Band-Bilder zu kurzen Clips animieren; Schläge im Schnitt auf die Taktschläge legen.
5. Schnitt: Gesangsclips auf die Live-Tonspur legen, alle 2 bis 4 Sekunden Publikum, Band oder Totale dazwischenschneiden, letzte 2 Sekunden ausblenden.
6. Ausgewählte Clips in höherer Auflösung neu erzeugen oder hochskalieren. Hochskalieren von 480p auf 1080p sah schlecht aus; besser gleich in 720p erzeugen.

## 9. Wünsche des Auftraggebers

- Der Auftritt soll lebendig sein: lässig zum Publikum, mit Gesten, nicht statisch.
- Es soll nach Live klingen: Publikum und Hall.
- Beide Sängerinnen singen gemeinsam.
- Vor jedem kostenpflichtigen Start ausdrücklich fragen.
