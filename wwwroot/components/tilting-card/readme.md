Tilting card web component
==========================

Based on Kevin Powell's [Create a tilting card on hover with CSS only](https://www.youtube.com/watch?v=eOJTj_mWJds).

Eventhough the plain CSS approach  explained by Kevin is nice, I am not found of adding markup solely for CSS tricks. So I attempted to hide
the generation of the `<div>`s in a web component.

There are two issues with the plain CSS approch:  
1. the grid is over the panel and prevent interaction. 
2. the `tilting-card` styles are to be defined for both `tilting-card:not(:defined)` and `tilting-card::part(body)`

The "mostly js" variant fixes both issues, and creates a simpler DOM.

> **Note**  
> Investigate upgrading the grid for a smoother experience.

More
----

- [Front-end dev reacts to amazing CSS-only Codepens](https://youtu.be/CG__N4SS1Fc?t=67)
- [3D effect on hover - CSS only](https://codepen.io/onediv/pen/BprVzp), by Vincent Durand
