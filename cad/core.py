import cadquery as cq

# --- CONFIGURABLE PARAMETERS ---
limb_dia = 900.0  # Max width of the center step
window_height = 2500.0  # Clear height between yokes
limb_pitch = 1800.0  # Distance between leg centers
yoke_height = 950.0  # Height of the yoke blocks

# Cruciform Configuration: (Width, Depth)
# Add or remove tuples here to change the number of steps
cruciform_steps = [(900.0, 500.0), (750.0, 700.0), (550.0, 850.0)]


def make_cruciform(length):
    """Creates a stepped core member centered on the origin."""
    # Start with the first step
    core = cq.Workplane("XY").box(cruciform_steps[0][0], cruciform_steps[0][1], length)
    # Union subsequent steps
    for w, d in cruciform_steps[1:]:
        core = core.union(cq.Workplane("XY").box(w, d, length))
    return core


def miter_vertical_leg(obj, height):
    """Slices the leg at 45 deg across the FRONT face (X-Z plane)."""
    cutter_size = limb_dia * 4
    # Top Cutter - Rotated around Y to slice the face
    top_c = (
        cq.Workplane("XY")
        .box(cutter_size, cutter_size, cutter_size)
        .translate((0, 0, cutter_size / 2))
        .rotate((0, 0, 0), (0, 1, 0), 45)
        .translate((0, 0, height / 2))
    )
    # Bottom Cutter
    bottom_c = (
        cq.Workplane("XY")
        .box(cutter_size, cutter_size, cutter_size)
        .translate((0, 0, -cutter_size / 2))
        .rotate((0, 0, 0), (0, 1, 0), -45)
        .translate((0, 0, -height / 2))
    )
    return obj.cut(top_c).cut(bottom_c)


# --- CONSTRUCTION ---

# 1. Central Leg (Flat/Butt ends)
center_leg = make_cruciform(window_height)

# 2. Outer Legs (Mitered)
# Total height = window + width of the widest lamination step
outer_leg_h = window_height + cruciform_steps[0][0]
left_leg = miter_vertical_leg(make_cruciform(outer_leg_h), outer_leg_h).translate(
    (-limb_pitch, 0, 0)
)
right_leg = miter_vertical_leg(make_cruciform(outer_leg_h), outer_leg_h).translate(
    (limb_pitch, 0, 0)
)

# 3. Yokes (Horizontal)
yoke_len = (limb_pitch * 2) + cruciform_steps[0][0]
yoke_raw = make_cruciform(yoke_len).rotate((0, 0, 0), (0, 1, 0), 90)


def miter_yoke(obj, length):
    """Slices yoke ends at 45 deg to match the leg miters."""
    cutter_size = limb_dia * 4
    # Slice ends in the same face-plane
    left_c = (
        cq.Workplane("XY")
        .box(cutter_size, cutter_size, cutter_size)
        .translate((-cutter_size / 2, 0, 0))
        .rotate((0, 0, 0), (0, 1, 0), -45)
        .translate((-length / 2, 0, 0))
    )
    right_c = (
        cq.Workplane("XY")
        .box(cutter_size, cutter_size, cutter_size)
        .translate((cutter_size / 2, 0, 0))
        .rotate((0, 0, 0), (0, 1, 0), 45)
        .translate((length / 2, 0, 0))
    )
    return obj.cut(left_c).cut(right_c)


yoke_final = miter_yoke(yoke_raw, yoke_len)
top_yoke = yoke_final.translate((0, 0, (window_height / 2 + yoke_height / 2)))
bottom_yoke = yoke_final.translate((0, 0, -(window_height / 2 + yoke_height / 2)))

# --- ASSEMBLY ---
parts = [center_leg, left_leg, right_leg, top_yoke, bottom_yoke]
transformer_core = cq.Compound.makeCompound([p.val() for p in parts])

cq.exporters.export(transformer_core, "transformer_core_final.step")
print("Exported: transformer_core_final.step")
