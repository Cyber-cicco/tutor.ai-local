When parsing the latex, I get an error :

<span class="katex-error" title="ParseError: KaTeX parse error: Expected 'EOF', got '&amp;' at position 3: 1 &amp;̲ 2 \\
3 &amp; 4
\en…" style="color: rgb(204, 0, 0);">

Here is the content I tried to parse:


Imaginez que votre magasin a des stocks pour la semaine 1, représentés par la matrice $S_1$, et pour la semaine 2, représentés par la matrice $S_2$. Pour connaître le total des stocks sur deux semaines, vous devez additionner les deux matrices. Mais comment faire ?--- ## La règle d'or: mêmes dimensionsPour pouvoir additionner ou soustraire deux matrices, elles doivent absolument avoir la **même dimension**. Autrement dit, si une matrice est de dimension $m \times n$, l'autre doit aussi être de dimension $m \times n$. Si ce n'est pas le cas, l'opération est impossible.--- ## Addition et soustraction élément par élémentSi les matrices $A$ et $B$ ont la même dimension, leur somme $A+B$ (ou leur différence $A-B$) est une nouvelle matrice $C$ de la même dimension. Pour trouver chaque élément de $C$, il suffit d'additionner (ou de soustraire) les éléments correspondants de $A$ et $B$. $$c_{ij} = a_{ij} + b_{ij}$$Par exemple, soit deux matrices $A$ et $B$ de dimension $2 \times 2$:$$A = \begin{pmatrix}1 & 2 \\3 & 4\end{pmatrix}, \quad B = \begin{pmatrix}5 & 6 \\7 & 8\end{pmatrix}$$Pour trouver $A+B$, on additionne les éléments de la même position:$$A+B = \begin{pmatrix}1+5 & 2+6 \\3+7 & 4+8\end{pmatrix} = \begin{pmatrix}6 & 8 \\10 & 12\end{pmatrix}$$La soustraction suit la même logique. Pour trouver $A-B$:$$A-B = \begin{pmatrix}1-5 & 2-6 \\3-7 & 4-8\end{pmatrix} = \begin{pmatrix}-4 & -4 \\-4 & -4\end{pmatrix}$$Les opérations d'addition et de soustraction de matrices sont **commutatives** (l'ordre n'importe pas) et **associatives**.

All of it worked well, until the \begin{pmatrix}1 & 2 \\3 & 4\end{pmatrix}

Also, I have managed already to show a matrice correctly, here is what the content of the matrice showing correctly looks like:

# Opérations Fondamentales sur les Matrices

## Problème à résoudre
Vous développez un filtre pour améliorer la luminosité d'une image. Comment pouvez-vous augmenter uniformément la luminosité de tous les pixels de 20% ? Et comment combiner plusieurs filtres ? Les opérations matricielles vont nous donner la réponse !

## Addition et Soustraction de Matrices

### Règle fondamentale
**On ne peut additionner ou soustraire que des matrices de même dimension !**

L'opération se fait **élément par élément** :

$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} + \begin{pmatrix} e & f \\ g & h \end{pmatrix} = \begin{pmatrix} a+e & b+f \\ c+g & d+h \end{pmatrix}$$

### Exemple concret
Soit deux images de 2×2 pixels :
- Image A (luminosité actuelle) : $$A = \begin{pmatrix} 100 & 150 \\ 80 & 200 \end{pmatrix}$$
- Correction B (ajout de luminosité) : $$B = \begin{pmatrix} 20 & 20 \\ 20 & 20 \end{pmatrix}$$

Image corrigée = A + B :
$$A + B = \begin{pmatrix} 100+20 & 150+20 \\ 80+20 & 200+20 \end{pmatrix} = \begin{pmatrix} 120 & 170 \\ 100 & 220 \end{pmatrix}$$

## Multiplication par un Scalaire

Un **scalaire** est un nombre simple (pas une matrice). La multiplication se fait en multipliant **chaque élément** de la matrice par ce nombre.

### Formule
$$k \times \begin{pmatrix} a & b \\ c & d \end{pmatrix} = \begin{pmatrix} k \times a & k \times b \\ k \times c & k \times d \end{pmatrix}$$

### Exemple pratique
Pour augmenter la luminosité de 20% (multiplier par 1.2) :
$$1.2 \times \begin{pmatrix} 100 & 150 \\ 80 & 200 \end{pmatrix} = \begin{pmatrix} 120 & 180 \\ 96 & 240 \end{pmatrix}$$

## Applications en Intelligence Artificielle

### 1. Traitement d'images
- **Ajustement de luminosité** : addition/soustraction de matrices
- **Ajustement de contraste** : multiplication par un scalaire
- **Combinaison de filtres** : addition de plusieurs matrices de correction

### 2. Réseaux de neurones
Dans les réseaux de neurones, l'addition matricielle est utilisée pour ajouter les biais à chaque couche. La multiplication par un scalaire peut représenter un facteur d'apprentissage.

### 3. Normalisation des données
Pour normaliser des données (centrer autour de 0), on soustrait la moyenne :
$$X_{\text{normalisé}} = X - \mu$$
où μ est une matrice contenant les moyennes.

## Propriétés importantes

### Commutativité
$$A + B = B + A$$

### Associativité
$$A + (B + C) = (A + B) + C$$

### Élément neutre
La matrice nulle (tous éléments = 0) est l'élément neutre de l'addition :
$$A + 0 = A$$

### Distributivité avec les scalaires
$$k(A + B) = kA + kB$$
$$(k + m)A = kA + mA$$

## Retour sur notre problème
Pour notre filtre de luminosité, nous avons maintenant plusieurs options :
1. **Addition** : Ajouter une valeur fixe à tous les pixels
2. **Multiplication** : Augmenter proportionnellement la luminosité
3. **Combinaison** : Appliquer plusieurs corrections successives

Ces opérations simples sont la base de filtres complexes en traitement d'image et de calculs dans les réseaux de neurones !
﻿


