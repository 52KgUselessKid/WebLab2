package com.example.areacheck;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import jakarta.persistence.Query;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Named("resultsBean")
@SessionScoped
public class ResultsBean implements Serializable {
    private List<ResultRecord> results = new ArrayList<>();
    private transient EntityManager em;

    public ResultsBean() {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("pu");
        em = emf.createEntityManager();
        loadResults();
    }

    private void loadResults() {
        Query q = em.createQuery("SELECT r FROM ResultRecord r ORDER BY r.id DESC");
        results = q.getResultList();
    }

    public void add(ResultRecord record) {
        em.getTransaction().begin();
        em.persist(record);
        em.getTransaction().commit();
        results.add(0, record);  // Add to beginning for latest first
    }

    public void clear() {
        em.getTransaction().begin();
        Query delete = em.createQuery("DELETE FROM ResultRecord");
        delete.executeUpdate();
        em.getTransaction().commit();
        results.clear();
    }

    public List<ResultRecord> getResults() {
        return results;
    }
}