.PHONY: clean default

default: data/output/tracts.mbtiles

clean: 
	rm -rf data/output

bbox: public/county-bbox.json

public/county-bbox.json: data/output/cb_2021_us_county_500k/cb_2021_us_county_500k.shp
	mkdir -p $(dir $@)
	npx mapshaper -i $^ \
		-filter "parseInt(STATEFP) < 60" \
		-each "bbox=this.bounds" \
		-drop fields="GEOID,STATEFP,COUNTYFP,AFFGEOID,COUNTYNS,NAME,STUSPS,LSAD,ALAND,AWATER" \
		-o format=json $@
	touch $@

data/output/cb_2021_us_county_500k/cb_2021_us_county_500k.shp: data/output/cb_2021_us_county_500k.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@

data/output/cb_2021_us_county_500k.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2021/shp/cb_2021_us_county_500k.zip
	touch $@




data/output/tracts.mbtiles: data/output/tract_geo.json
	tippecanoe -z10 -Z3 -o $@ --coalesce-densest-as-needed -n "Tracts as pulled from TIGER in 2021" --use-attribute-for-id="GEOID" -aI data/output/tract_geo.json

data/output/tract_geo.json: data/output/cb_2021_us_tract_500k/cb_2021_us_tract_500k.shp
	mkdir -p $(dir $@)
	npx mapshaper $^ snap \
		-filter "parseInt(STATEFP) < 60" \
		-filter-fields "GEOID,STATEFP,COUNTYFP" \
		-o format=geojson $@
	touch $@

data/output/cb_2021_us_tract_500k/cb_2021_us_tract_500k.shp: data/output/cb_2021_us_tract_500k.zip
	mkdir -p $(dir $@)
	unzip -o $^ -d $(dir $@)
	touch $@

data/output/cb_2021_us_tract_500k.zip:
	mkdir -p $(dir $@)
	curl -o $@ -L https://www2.census.gov/geo/tiger/GENZ2021/shp/cb_2021_us_tract_500k.zip
	touch $@
