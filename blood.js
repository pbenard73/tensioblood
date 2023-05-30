
	const blood =		(() => {
				let data = [];
				let myChart;
				
				window.addEventListener('resize', () => {
				  myChart?.resize?.();
				});
				
				const download = () => {
					let blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
					let url = window.URL.createObjectURL(blob);
					    let link = document.createElement("a");
					    link.download = 'tension.json';
					    link.href = url;
					    link.click();
					window.URL.revokeObjectURL(url);
				}
				
				document.querySelector('#save').onclick = download;
				document.querySelector('#print').onclick = () => window.print();
				
				document.querySelector('#open').onchange = function() {
					var file = this.files[0];
					if (file) {
					    var reader = new FileReader();
					    reader.readAsText(file, "UTF-8");
					    reader.onload = function (evt) {
						try {
							const json = JSON.parse(evt.target.result);
							json.sort((a,b) => a.date < b.date ? +1 : -1)
							data = json;
							paintData();
						} catch(e) {
						console.log(e);
							alert("error reading file");
						}
					    }
					    reader.onerror = function (evt) {
						alert("error reading file");
					    }
					}
				}
				
				const form =document.querySelector('form');
				form.onsubmit = (e) => {
					e.preventDefault();
					data.unshift({
						date: document.querySelector('[name="date"]').value,
						sys: document.querySelector('[name="sys"]').value,
						dia: document.querySelector('[name="dia"]').value,
					});
					paintData();
				}


				const paintData = () => {
					data.sort((a,b) => a.date < b.date ? +1 : -1)
					const table = document.createElement('table')
					table.classList.add('table');
					table.classList.add('table-striped');
					table.classList.add('table-hover');

					const body = document.createElement('tbody')

					const innerHTML = `
						<tr>
						<td><input name="date" class="form-control"  required type="datetime-local" id="sys" placeholder="date" /></td>
						<td><input name="sys" class="form-control"  required type="number" id="sys" placeholder="sys" /></td>
						<td>
						<input name="dia" type="number" class="form-control"  id="dia" placeholder="dia" />
						<input type="submit" style="display:none;" />
						</td>
						</tr>
						${data.map(datum => `
							
						<tr>
						<td>${(new Date(datum.date)).toLocaleString()}</td>
						<td>${datum.sys}</td>
						<td>${datum.dia}</td>
						</tr>`
						 ).join('') }
						
					`
					
					body.innerHTML = innerHTML;
					table.append(body);
					form.innerHTML = '';
					form.append(table)
					paintChart();
				}
				
				const paintChart = () => {
				if (myChart) {
					myChart.destroy();

				}
					const labels = [(new Date()).toLocaleString(),...data.map(i => (new Date(i.date)).toLocaleString()).reverse()] ;
					const dataset = {
					  labels: labels,
					  datasets: [{
					    label: 'sys',
					    data: data.map(i => i.sys).reverse(),
					    fill: false,
					    borderColor: 'blue',
					    tension: 0.1
					  },{
					    label: 'dia',
					    data: data.map(i => i.dia).reverse(),
					    fill: false,
					    borderColor: 'black',
					    tension: 0.1
					  },{
					    label: 'sys/12',
					    data: [...data.map(i => 120), 120],
					    fill: false,
					    borderColor: '#0025ff21',
					    tension: 0.1
					  },{
					    label: 'dia/8',
					    data: [...data.map(i => 80), 80],
					    fill: false,
					    borderColor: '#0101013b',
					    tension: 0.1
					  }]
					};
					myChart = new Chart(
					    document.getElementById('chart'),
					    {
					      type: 'line',
					      data: dataset,
					      options: {
						    animations: {
						      tension: {
							duration: 2000,
							easing: 'linear',
							from: 0.1,
							to: 0.3,
							loop: true
						      }
						    }
					    }
					    }
					  );
				}
				
				paintData();


			})
