# 3D Physics Engine and Screen Projection

The 3D interactive graph is driven by a real-time **Force-Directed** algorithm executing three main forces inside the `requestAnimationFrame` loop:

## 1. Coulomb Repulsion
Close nodes push each other away inversely proportional to the square of their distance:
$$F_{rep} = \frac{K_{rep}}{d^2}$$

## 2. Hooke Attraction
Connected sequential nodes attract each other proportionally to their distance:
$$F_{att} = K_{att} \times d$$

## 3. Centripetal Gravity
All nodes experience a constant center-pull gravity pulling them back to the origin `(0,0,0)` to prevent the graph from dispersing to infinity.

## 4. 3D to 2D Screen Projection
Once the 3D coordinate space updates, positions are projected onto the 2D canvas viewport using focal length calculation ($D_{foc} = 350$), zoom ratio, and camera angle rotation:
$$Scale = \frac{D_{foc}}{D_{foc} + Z_{proj}} \times Zoom$$
$$X_{screen} = C_x + X_{proj} \times Scale$$
$$Y_{screen} = C_y + Y_{proj} \times Scale$$
